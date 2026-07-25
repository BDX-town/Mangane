import { queryClient } from 'soapbox/queries/client';
import KVStore from 'soapbox/storage/kv_store';
import { disconnectAllStreams } from 'soapbox/stream';

import { removePersistedAccountCredentials } from './auth-storage';
import { runBoundedStep } from './bounded-step';
import { clearApplicationCacheStorage } from './cache-storage';
import { broadcastAccountPurge } from './cross-tab';
import { activateAccountGeneration, completeAccountGenerationPurge, revokeAccountGeneration } from './lifecycle';
import { revokeAllTrackedObjectURLs } from './object-urls';

import type { BoundedStepResult, BoundedStepStatus } from './bounded-step';

interface PurgeScope {
  accountUrl: string,
  accessToken?: string,
  propagate?: boolean,
}

interface PurgeReport {
  scope: string,
  results: BoundedStepResult[],
}

interface PurgeDependencies {
  remoteRevocation: () => Promise<unknown>,
  localLogout: () => void | Promise<void>,
  cancelAndClearQueries: () => Promise<void>,
  disconnectStreams: () => void,
  removeAccountSnapshot: () => Promise<unknown>,
  removePersistedCredentials: () => void,
  clearApplicationCaches: () => Promise<void>,
  invalidateWorkerAndNotifications: () => Promise<void>,
  removeTransientCredentials: () => void,
  revokeTemporaryResources: () => void,
}

const DEFAULT_STEP_TIMEOUT = 5000;
const PURGE_TOMBSTONE_KEY = 'soapbox:purge:accounts';
const activePurges = new Map<string, Promise<PurgeReport>>();
const revokedScopes = new Set<string>();

const readPendingScopes = (): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(PURGE_TOMBSTONE_KEY) || '[]');
    return Array.isArray(value) ? value.filter(scope => typeof scope === 'string') : [];
  } catch {
    return [];
  }
};

const writePendingScopes = (scopes: string[]): boolean => {
  try {
    if (scopes.length) {
      localStorage.setItem(PURGE_TOMBSTONE_KEY, JSON.stringify([...new Set(scopes)]));
    } else {
      localStorage.removeItem(PURGE_TOMBSTONE_KEY);
    }
    return true;
  } catch {
    return false;
  }
};

const markPending = (accountUrl: string, propagate = true): { generation: number, persisted: boolean } => {
  revokedScopes.add(accountUrl);
  const lifecycle = revokeAccountGeneration(accountUrl);
  const persisted = writePendingScopes([...readPendingScopes(), accountUrl]) && lifecycle.persisted;
  if (propagate) broadcastAccountPurge(accountUrl, lifecycle.generation);
  return { generation: lifecycle.generation, persisted };
};

const completePending = (accountUrl: string): boolean => {
  const journalCompleted = writePendingScopes(readPendingScopes().filter(scope => scope !== accountUrl));
  const lifecycleCompleted = completeAccountGenerationPurge(accountUrl);
  return journalCompleted && lifecycleCompleted;
};

const isAccountPersistenceBlocked = (accountUrl: string): boolean =>
  revokedScopes.has(accountUrl) || readPendingScopes().includes(accountUrl);

const activateAccountPersistence = (accountUrl: string): boolean => {
  if (readPendingScopes().includes(accountUrl)) return false;
  revokedScopes.delete(accountUrl);
  return activateAccountGeneration(accountUrl);
};

const closeScopedNotifications = async(accessToken?: string): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  // eslint-disable-next-line compat/compat
  const registration = await navigator.serviceWorker.ready;
  let workerAcknowledgement = Promise.resolve();
  if (registration.active && accessToken && typeof MessageChannel !== 'undefined') {
    workerAcknowledgement = new Promise<void>((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = event => {
        channel.port1.close();
        if (event.data?.type === 'PURGE_ACCOUNT_ACK') resolve();
        else reject(new Error('INVALID_PURGE_ACCOUNT_ACK'));
      };
      registration.active?.postMessage({ type: 'PURGE_ACCOUNT', accessToken }, [channel.port2]);
    });
  } else {
    registration.active?.postMessage({ type: 'PURGE_ACCOUNT', accessToken });
  }

  const subscription = await registration.pushManager?.getSubscription();
  await subscription?.unsubscribe();

  if (registration.getNotifications) {
    const notifications = await registration.getNotifications();
    notifications
      .filter(notification => !accessToken || notification.data?.access_token === accessToken)
      .forEach(notification => notification.close());
  }
  await workerAcknowledgement;
};

const defaultDependencies = (scope: PurgeScope): Omit<PurgeDependencies, 'remoteRevocation' | 'localLogout'> => ({
  cancelAndClearQueries: async() => {
    await queryClient.cancelQueries();
    queryClient.clear();
  },
  disconnectStreams: disconnectAllStreams,
  removeAccountSnapshot: () => KVStore.removeItem(`authAccount:${scope.accountUrl}`),
  removePersistedCredentials: () => removePersistedAccountCredentials(scope.accountUrl, scope.accessToken),
  clearApplicationCaches: clearApplicationCacheStorage,
  invalidateWorkerAndNotifications: () => closeScopedNotifications(scope.accessToken),
  removeTransientCredentials: () => {
    [
      'soapbox:external:app',
      'soapbox:external:baseurl',
      'soapbox:external:scopes',
    ].forEach(key => localStorage.removeItem(key));
  },
  revokeTemporaryResources: revokeAllTrackedObjectURLs,
});

/**
 * Purge account-private browser state. Every step is bounded and failure-isolated:
 * remote revocation and any individual local failure can never block later cleanup.
 */
const purgeAccountScope = (
  scope: PurgeScope,
  dependencies: Pick<PurgeDependencies, 'remoteRevocation' | 'localLogout'> & Partial<PurgeDependencies>,
  timeout = DEFAULT_STEP_TIMEOUT,
): Promise<PurgeReport> => {
  const existing = activePurges.get(scope.accountUrl);
  if (existing) return existing;

  const deps = { ...defaultDependencies(scope), ...dependencies };
  const purge = (async() => {
    const results: BoundedStepResult[] = [];
    const pending = markPending(scope.accountUrl, scope.propagate);
    results.push({
      step: 'persist-purge-tombstone',
      status: pending.persisted ? 'completed' : 'failed',
    });

    await runBoundedStep(results, 'disconnect-streams-and-polling', deps.disconnectStreams, timeout);
    await runBoundedStep(results, 'cancel-and-clear-query-cache', deps.cancelAndClearQueries, timeout);
    await runBoundedStep(results, 'bounded-remote-revocation', deps.remoteRevocation, timeout);
    await runBoundedStep(results, 'local-redux-logout', deps.localLogout, timeout);
    await runBoundedStep(results, 'remove-persisted-account-credentials', deps.removePersistedCredentials, timeout);
    await runBoundedStep(results, 'remove-account-snapshot', deps.removeAccountSnapshot, timeout);
    await runBoundedStep(results, 'remove-transient-credentials', deps.removeTransientCredentials, timeout);
    await runBoundedStep(results, 'clear-application-cache-storage', deps.clearApplicationCaches, timeout);
    await runBoundedStep(results, 'invalidate-worker-and-close-notifications', deps.invalidateWorkerAndNotifications, timeout);
    await runBoundedStep(results, 'revoke-object-urls-and-temporary-resources', deps.revokeTemporaryResources, timeout);

    const localResults = results.filter(result => result.step !== 'bounded-remote-revocation');
    if (localResults.every(result => result.status === 'completed')) {
      await runBoundedStep(results, 'complete-purge-tombstone', () => {
        if (!completePending(scope.accountUrl)) throw new Error('PURGE_TOMBSTONE_WRITE_FAILED');
      }, timeout);
    }

    return { scope: 'account', results };
  })().finally(() => {
    activePurges.delete(scope.accountUrl);
  });

  activePurges.set(scope.accountUrl, purge);
  return purge;
};

const resumePendingPurges = async(
  localLogout: (accountUrl: string) => void | Promise<void>,
  dependencies: Partial<Omit<PurgeDependencies, 'localLogout' | 'remoteRevocation'>> = {},
  resolveAccessToken: (accountUrl: string) => string | undefined = () => undefined,
): Promise<PurgeReport[]> => {
  const scopes = readPendingScopes();
  return Promise.all(scopes.map(accountUrl => purgeAccountScope({
    accountUrl,
    accessToken: resolveAccessToken(accountUrl),
  }, {
    ...dependencies,
    remoteRevocation: async() => undefined,
    localLogout: () => localLogout(accountUrl),
  })));
};

export {
  activateAccountPersistence,
  isAccountPersistenceBlocked,
  purgeAccountScope,
  resumePendingPurges,
};

export type {
  PurgeDependencies,
  PurgeReport,
  PurgeScope,
  BoundedStepResult as PurgeStepResult,
  BoundedStepStatus as PurgeStatus,
};

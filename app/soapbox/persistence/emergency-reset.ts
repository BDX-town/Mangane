import * as BuildConfig from 'soapbox/build_config';
import { queryClient } from 'soapbox/queries/client';
import KVStore from 'soapbox/storage/kv_store';

import { runBoundedStep } from './bounded-step';
import { revokeAllTrackedObjectURLs } from './object-urls';

import type { BoundedStepResult } from './bounded-step';

interface EmergencyResetDependencies {
  cancelAndClearQueries: () => Promise<void>,
  clearLocalStorage: () => void,
  clearSessionStorage: () => void,
  clearKVStore: () => Promise<unknown>,
  clearCacheStorage: () => Promise<void>,
  closeNotificationsAndUnregisterWorkers: () => Promise<void>,
  revokeTemporaryResources: () => void,
  navigate: () => void,
}

interface EmergencyResetReport {
  scope: 'origin',
  results: BoundedStepResult[],
}

const DEFAULT_STEP_TIMEOUT = 5000;
let activeReset: Promise<EmergencyResetReport> | undefined;

const clearCacheStorage = async(): Promise<void> => {
  if (!('caches' in window)) return;

  const keys = await caches.keys();
  await Promise.all(keys.map(key => caches.delete(key)));
};

const closeNotificationsAndUnregisterWorkers = async(): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  // eslint-disable-next-line compat/compat
  const registrations = await navigator.serviceWorker.getRegistrations();
  const settle = (operation: Promise<unknown>): Promise<boolean> =>
    operation.then(() => true, () => false);
  const operations = registrations.flatMap(registration => {
    const notificationCleanup = registration.getNotifications
      ? registration.getNotifications()
        .then(notifications => notifications.forEach(notification => notification.close()))
      : Promise.resolve();
    const pushCleanup = registration.pushManager
      ? registration.pushManager.getSubscription()
        .then(subscription => subscription?.unsubscribe())
      : Promise.resolve();

    return [notificationCleanup, pushCleanup, registration.unregister()].map(settle);
  });
  const outcomes = await Promise.all(operations);

  if (outcomes.some(succeeded => !succeeded)) {
    throw new Error('EMERGENCY_WORKER_CLEANUP_INCOMPLETE');
  }
};

const defaultDependencies = (): EmergencyResetDependencies => ({
  cancelAndClearQueries: async() => {
    await queryClient.cancelQueries();
    queryClient.clear();
  },
  clearLocalStorage: () => localStorage.clear(),
  clearSessionStorage: () => sessionStorage.clear(),
  clearKVStore: () => KVStore.clear(),
  clearCacheStorage,
  closeNotificationsAndUnregisterWorkers,
  revokeTemporaryResources: revokeAllTrackedObjectURLs,
  navigate: () => window.location.assign(BuildConfig.FE_SUBDIRECTORY || '/'),
});

const emergencyReset = (
  dependencies: Partial<EmergencyResetDependencies> = {},
  timeout = DEFAULT_STEP_TIMEOUT,
): Promise<EmergencyResetReport> => {
  if (activeReset) return activeReset;

  const deps = { ...defaultDependencies(), ...dependencies };
  const reset = (async() => {
    const results: BoundedStepResult[] = [];

    await runBoundedStep(results, 'cancel-and-clear-query-cache', deps.cancelAndClearQueries, timeout);
    await runBoundedStep(results, 'clear-local-storage', deps.clearLocalStorage, timeout);
    await runBoundedStep(results, 'clear-session-storage', deps.clearSessionStorage, timeout);
    await runBoundedStep(results, 'clear-indexeddb-kv-store', deps.clearKVStore, timeout);
    await runBoundedStep(results, 'clear-cache-storage', deps.clearCacheStorage, timeout);
    await runBoundedStep(results, 'close-notifications-and-unregister-workers', deps.closeNotificationsAndUnregisterWorkers, timeout);
    await runBoundedStep(results, 'revoke-object-urls-and-temporary-resources', deps.revokeTemporaryResources, timeout);

    // Repeat authoritative stores after asynchronous cleanup to remove late writes
    // that raced the first pass while the crashed application was still alive.
    await runBoundedStep(results, 'final-clear-local-storage', deps.clearLocalStorage, timeout);
    await runBoundedStep(results, 'final-clear-session-storage', deps.clearSessionStorage, timeout);
    await runBoundedStep(results, 'final-clear-indexeddb-kv-store', deps.clearKVStore, timeout);
    await runBoundedStep(results, 'navigate-to-application-root', deps.navigate, timeout);

    return { scope: 'origin' as const, results };
  })().finally(() => {
    activeReset = undefined;
  });

  activeReset = reset;
  return reset;
};

export {
  clearCacheStorage,
  closeNotificationsAndUnregisterWorkers,
  emergencyReset,
};

export type {
  EmergencyResetDependencies,
  EmergencyResetReport,
};

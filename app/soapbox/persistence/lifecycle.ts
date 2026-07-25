interface AccountGeneration {

  accountUrl: string,
  generation: number,

}

class StaleSessionGenerationError extends Error {

  code = 'STALE_SESSION_GENERATION';

  constructor() {
    super('Request result belongs to an inactive session generation');
    this.name = 'StaleSessionGenerationError';
  }

}

interface PersistedScope {
  generation: number,
  status: 'active' | 'purging' | 'purged',
}

interface PersistedLifecycle {
  schemaVersion: 1,
  scopes: Record<string, PersistedScope>,
}

const LIFECYCLE_KEY = 'soapbox:persistence:lifecycle:v1';
const EMPTY_LIFECYCLE: PersistedLifecycle = { schemaVersion: 1, scopes: {} };
let sessionGeneration = 0;
const volatileScopes = new Map<string, PersistedScope>();

const isPersistedScope = (value: unknown): value is PersistedScope => {
  if (!value || typeof value !== 'object') return false;
  const scope = value as Partial<PersistedScope>;
  return Number.isSafeInteger(scope.generation)
    && Number(scope.generation) >= 0
    && ['active', 'purging', 'purged'].includes(String(scope.status));
};

const readLifecycle = (): PersistedLifecycle => {
  try {
    const raw = localStorage.getItem(LIFECYCLE_KEY);
    if (!raw) return { ...EMPTY_LIFECYCLE, scopes: {} };
    const parsed = JSON.parse(raw) as Partial<PersistedLifecycle>;
    if (parsed.schemaVersion !== 1 || !parsed.scopes || typeof parsed.scopes !== 'object') {
      throw new Error('UNSUPPORTED_PERSISTENCE_LIFECYCLE');
    }

    const scopes = Object.entries(parsed.scopes).reduce<Record<string, PersistedScope>>((result, [accountUrl, scope]) => {
      if (isPersistedScope(scope)) result[accountUrl] = scope;
      return result;
    }, {});
    return { schemaVersion: 1, scopes };
  } catch {
    // This store contains lifecycle metadata only. A malformed record must fail
    // closed, and removing it lets the purge tombstone remain the fallback.
    try {
      localStorage.removeItem(LIFECYCLE_KEY);
    } catch {
      // Storage denial is handled by the caller's purge report.
    }
    return { ...EMPTY_LIFECYCLE, scopes: {} };
  }
};

const writeLifecycle = (lifecycle: PersistedLifecycle): boolean => {
  try {
    localStorage.setItem(LIFECYCLE_KEY, JSON.stringify(lifecycle));
    return true;
  } catch {
    return false;
  }
};

const getPersistedScope = (accountUrl: string): PersistedScope | undefined =>
  volatileScopes.get(accountUrl) || readLifecycle().scopes[accountUrl];

const captureAccountGeneration = (accountUrl: string): AccountGeneration => ({
  accountUrl,
  generation: getPersistedScope(accountUrl)?.generation || 0,
});

const isAccountGenerationActive = ({ accountUrl, generation }: AccountGeneration): boolean => {
  const scope = getPersistedScope(accountUrl);
  return (!scope || scope.status === 'active') && (scope?.generation || 0) === generation;
};

const needsAccountPurge = (accountUrl: string, generation: number): boolean => {
  const scope = getPersistedScope(accountUrl);
  return scope?.status === 'purging' && scope.generation === generation;
};

const revokeAccountGeneration = (accountUrl: string): { generation: number, persisted: boolean } => {
  const lifecycle = readLifecycle();
  const current = getPersistedScope(accountUrl);
  if (current?.status === 'purging' || current?.status === 'purged') {
    sessionGeneration += 1;
    return { generation: current.generation, persisted: true };
  }
  const generation = (current?.generation || 0) + 1;
  const scope: PersistedScope = { generation, status: 'purging' };
  lifecycle.scopes[accountUrl] = scope;
  volatileScopes.set(accountUrl, scope);
  sessionGeneration += 1;
  return { generation, persisted: writeLifecycle(lifecycle) };
};

const completeAccountGenerationPurge = (accountUrl: string): boolean => {
  const lifecycle = readLifecycle();
  const generation = getPersistedScope(accountUrl)?.generation || 1;
  const scope: PersistedScope = { generation, status: 'purged' };
  lifecycle.scopes[accountUrl] = scope;
  volatileScopes.set(accountUrl, scope);
  return writeLifecycle(lifecycle);
};

const activateAccountGeneration = (accountUrl: string): boolean => {
  const lifecycle = readLifecycle();
  const generation = (getPersistedScope(accountUrl)?.generation || 0) + 1;
  const scope: PersistedScope = { generation, status: 'active' };
  lifecycle.scopes[accountUrl] = scope;
  volatileScopes.set(accountUrl, scope);
  sessionGeneration += 1;
  return writeLifecycle(lifecycle);
};

const advanceSessionGeneration = (): number => {
  sessionGeneration += 1;
  return sessionGeneration;
};

const captureSessionGeneration = (): number => sessionGeneration;
const isSessionGenerationActive = (generation: number): boolean => generation === sessionGeneration;
const assertSessionGenerationActive = (generation: number): void => {
  if (!isSessionGenerationActive(generation)) throw new StaleSessionGenerationError();
};
const resetPersistenceLifecycleMemory = (): void => {
  volatileScopes.clear();
  sessionGeneration += 1;
};

export {
  LIFECYCLE_KEY,
  activateAccountGeneration,
  advanceSessionGeneration,
  assertSessionGenerationActive,
  captureAccountGeneration,
  captureSessionGeneration,
  completeAccountGenerationPurge,
  isAccountGenerationActive,
  isSessionGenerationActive,
  needsAccountPurge,
  resetPersistenceLifecycleMemory,
  revokeAccountGeneration,
};

export { StaleSessionGenerationError };
export type { AccountGeneration };

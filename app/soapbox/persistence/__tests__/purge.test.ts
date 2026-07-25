import {
  activateAccountPersistence,
  isAccountPersistenceBlocked,
  purgeAccountScope,
  resumePendingPurges,
} from '../purge';

const scope = {
  accountUrl: 'https://social.example/users/alice',
  accessToken: 'secret-token',
};

const dependencies = () => ({
  cancelAndClearQueries: jest.fn(async() => undefined),
  disconnectStreams: jest.fn(() => undefined),
  remoteRevocation: jest.fn(async() => undefined),
  localLogout: jest.fn(async() => undefined),
  removePersistedCredentials: jest.fn(() => undefined),
  removeAccountSnapshot: jest.fn(async() => undefined),
  removeTransientCredentials: jest.fn(() => undefined),
  clearApplicationCaches: jest.fn(async() => undefined),
  invalidateWorkerAndNotifications: jest.fn(async() => undefined),
  revokeTemporaryResources: jest.fn(() => undefined),
});

describe('purgeAccountScope()', () => {
  beforeEach(() => {
    localStorage.removeItem('soapbox:purge:accounts');
  });

  it('runs cleanup in the required order', async() => {
    const calls: string[] = [];
    const deps = dependencies();
    for (const [name, operation] of Object.entries(deps)) {
      operation.mockImplementation(async() => {
        calls.push(name);
      });
    }

    const report = await purgeAccountScope(scope, deps);

    expect(calls).toEqual([
      'disconnectStreams',
      'cancelAndClearQueries',
      'remoteRevocation',
      'localLogout',
      'removePersistedCredentials',
      'removeAccountSnapshot',
      'removeTransientCredentials',
      'clearApplicationCaches',
      'invalidateWorkerAndNotifications',
      'revokeTemporaryResources',
    ]);
    expect(report.results.every(result => result.status === 'completed')).toBe(true);
  });

  it('continues all local cleanup when remote revocation fails', async() => {
    const deps = dependencies();
    deps.remoteRevocation.mockRejectedValue(new Error('offline'));

    const report = await purgeAccountScope(scope, deps);

    expect(deps.localLogout).toHaveBeenCalled();
    expect(deps.removeAccountSnapshot).toHaveBeenCalled();
    expect(deps.invalidateWorkerAndNotifications).toHaveBeenCalled();
    expect(report.results.find(result => result.step === 'bounded-remote-revocation')?.status).toBe('failed');
    expect(JSON.stringify(report)).not.toContain('offline');
    expect(JSON.stringify(report)).not.toContain(scope.accessToken);
    expect(JSON.stringify(report)).not.toContain(scope.accountUrl);
  });

  it('continues local cleanup when the purge journal cannot be persisted', async() => {
    const deps = dependencies();
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(key => {
      if (key === 'soapbox:purge:accounts') throw new DOMException('quota exceeded', 'QuotaExceededError');
    });

    try {
      const report = await purgeAccountScope({
        ...scope,
        accountUrl: 'https://social.example/users/quota-failure',
      }, deps);

      expect(report.results.find(result => result.step === 'persist-purge-tombstone')?.status).toBe('failed');
      expect(deps.localLogout).toHaveBeenCalled();
      expect(deps.removeAccountSnapshot).toHaveBeenCalled();
      expect(deps.invalidateWorkerAndNotifications).toHaveBeenCalled();
    } finally {
      setItem.mockRestore();
    }
  });

  it('deduplicates concurrent purge attempts for one account', async() => {
    let resolveRevocation: () => void = () => undefined;
    const deps = dependencies();
    deps.remoteRevocation.mockImplementation(() => new Promise<void>(resolve => {
      resolveRevocation = resolve;
    }));

    const first = purgeAccountScope(scope, deps);
    const second = purgeAccountScope(scope, deps);
    await new Promise(resolve => setTimeout(resolve, 0));
    resolveRevocation();

    await expect(first).resolves.toEqual(await second);
    expect(deps.remoteRevocation).toHaveBeenCalledTimes(1);
    expect(deps.localLogout).toHaveBeenCalledTimes(1);
  });

  it('continues cleanup after a bounded step times out', async() => {
    const deps = dependencies();
    deps.remoteRevocation.mockImplementation(() => new Promise(() => undefined));

    const report = await purgeAccountScope(scope, deps, 1);

    expect(report.results.find(result => result.step === 'bounded-remote-revocation')?.status).toBe('timed-out');
    expect(deps.localLogout).toHaveBeenCalled();
  });

  it('resumes an interrupted local purge from its tombstone', async() => {
    const interruptedScope = {
      accountUrl: 'https://social.example/users/interrupted',
      accessToken: 'interrupted-token',
    };
    const failing = dependencies();
    failing.removeAccountSnapshot.mockRejectedValue(new Error('indexeddb unavailable'));

    await purgeAccountScope(interruptedScope, failing);

    expect(isAccountPersistenceBlocked(interruptedScope.accountUrl)).toBe(true);
    expect(localStorage.getItem('soapbox:purge:accounts')).toContain(interruptedScope.accountUrl);

    const resumed = dependencies();
    const localLogout = jest.fn(async() => undefined);
    const resolveAccessToken = jest.fn(() => interruptedScope.accessToken);
    const reports = await resumePendingPurges(localLogout, resumed, resolveAccessToken);

    expect(reports).toHaveLength(1);
    expect(localLogout).toHaveBeenCalledWith(interruptedScope.accountUrl);
    expect(resolveAccessToken).toHaveBeenCalledWith(interruptedScope.accountUrl);
    expect(localStorage.getItem('soapbox:purge:accounts')).toBeNull();
    expect(activateAccountPersistence(interruptedScope.accountUrl)).toBe(true);
    expect(isAccountPersistenceBlocked(interruptedScope.accountUrl)).toBe(false);
  });

  it('blocks reactivation while an incomplete purge tombstone remains', async() => {
    const blockedScope = { ...scope, accountUrl: 'https://social.example/users/blocked' };
    const failing = dependencies();
    failing.removeAccountSnapshot.mockRejectedValue(new Error('unavailable'));

    await purgeAccountScope(blockedScope, failing);

    expect(activateAccountPersistence(blockedScope.accountUrl)).toBe(false);
    expect(isAccountPersistenceBlocked(blockedScope.accountUrl)).toBe(true);
  });
});

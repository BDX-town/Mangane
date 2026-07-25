import {
  clearCacheStorage,
  closeNotificationsAndUnregisterWorkers,
  emergencyReset,
} from '../emergency-reset';

const dependencies = () => ({
  cancelAndClearQueries: jest.fn(async() => undefined),
  clearLocalStorage: jest.fn(() => undefined),
  clearSessionStorage: jest.fn(() => undefined),
  clearKVStore: jest.fn(async() => undefined),
  clearCacheStorage: jest.fn(async() => undefined),
  closeNotificationsAndUnregisterWorkers: jest.fn(async() => undefined),
  revokeTemporaryResources: jest.fn(() => undefined),
  navigate: jest.fn(() => undefined),
});

describe('emergencyReset()', () => {
  it('clears every controlled surface in order and repeats authoritative stores', async() => {
    const calls: string[] = [];
    const deps = dependencies();
    for (const [name, operation] of Object.entries(deps)) {
      operation.mockImplementation(async() => {
        calls.push(name);
      });
    }

    const report = await emergencyReset(deps);

    expect(calls).toEqual([
      'cancelAndClearQueries',
      'clearLocalStorage',
      'clearSessionStorage',
      'clearKVStore',
      'clearCacheStorage',
      'closeNotificationsAndUnregisterWorkers',
      'revokeTemporaryResources',
      'clearLocalStorage',
      'clearSessionStorage',
      'clearKVStore',
      'navigate',
    ]);
    expect(report.scope).toBe('origin');
    expect(report.results.every(result => result.status === 'completed')).toBe(true);
  });

  it('continues cleanup and navigation after individual failures', async() => {
    const deps = dependencies();
    deps.clearKVStore.mockRejectedValue(new Error('indexeddb unavailable'));
    deps.clearCacheStorage.mockRejectedValue(new Error('cache unavailable'));

    const report = await emergencyReset(deps);

    expect(deps.closeNotificationsAndUnregisterWorkers).toHaveBeenCalled();
    expect(deps.clearLocalStorage).toHaveBeenCalledTimes(2);
    expect(deps.clearSessionStorage).toHaveBeenCalledTimes(2);
    expect(deps.navigate).toHaveBeenCalled();
    expect(report.results.filter(result => result.status === 'failed')).toHaveLength(3);
    expect(JSON.stringify(report)).not.toContain('indexeddb unavailable');
    expect(JSON.stringify(report)).not.toContain('cache unavailable');
  });

  it('bounds stalled cleanup and still performs the final pass', async() => {
    const deps = dependencies();
    deps.clearCacheStorage.mockImplementation(() => new Promise(() => undefined));

    const report = await emergencyReset(deps, 1);

    expect(report.results.find(result => result.step === 'clear-cache-storage')?.status).toBe('timed-out');
    expect(deps.clearKVStore).toHaveBeenCalledTimes(2);
    expect(deps.navigate).toHaveBeenCalled();
  });

  it('deduplicates concurrent emergency reset attempts', async() => {
    let release: () => void = () => undefined;
    const deps = dependencies();
    deps.cancelAndClearQueries.mockImplementation(() => new Promise<void>(resolve => {
      release = resolve;
    }));

    const first = emergencyReset(deps);
    const second = emergencyReset(deps);
    await Promise.resolve();
    release();

    await expect(first).resolves.toEqual(await second);
    expect(deps.cancelAndClearQueries).toHaveBeenCalledTimes(1);
    expect(deps.navigate).toHaveBeenCalledTimes(1);
  });
});

describe('emergency reset browser cleanup', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'caches');
    Reflect.deleteProperty(navigator, 'serviceWorker');
  });

  it('deletes every visible Cache Storage entry', async() => {
    const cacheStorage = {
      keys: jest.fn(async() => ['application', 'runtime']),
      delete: jest.fn(async() => true),
    };
    Object.defineProperty(window, 'caches', { configurable: true, value: cacheStorage });

    await clearCacheStorage();

    expect(cacheStorage.delete.mock.calls).toEqual([['application'], ['runtime']]);
  });

  it('closes notifications, unsubscribes push, and unregisters every worker', async() => {
    const close = jest.fn();
    const unsubscribe = jest.fn(async() => true);
    const unregister = jest.fn(async() => true);
    const registration = {
      getNotifications: jest.fn(async() => [{ close }]),
      pushManager: { getSubscription: jest.fn(async() => ({ unsubscribe })) },
      unregister,
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistrations: jest.fn(async() => [registration]) },
    });

    await closeNotificationsAndUnregisterWorkers();

    expect(close).toHaveBeenCalled();
    expect(unsubscribe).toHaveBeenCalled();
    expect(unregister).toHaveBeenCalled();
  });

  it('attempts all worker cleanup operations before reporting partial failure', async() => {
    const unsubscribe = jest.fn(async() => {
      throw new Error('push failure');
    });
    const unregister = jest.fn(async() => true);
    const registration = {
      getNotifications: jest.fn(async() => []),
      pushManager: { getSubscription: jest.fn(async() => ({ unsubscribe })) },
      unregister,
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistrations: jest.fn(async() => [registration]) },
    });

    await expect(closeNotificationsAndUnregisterWorkers()).rejects.toThrow('EMERGENCY_WORKER_CLEANUP_INCOMPLETE');
    expect(unregister).toHaveBeenCalled();
  });
});

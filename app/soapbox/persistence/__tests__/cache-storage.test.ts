import { clearApplicationCacheStorage } from '../cache-storage';

describe('application Cache Storage cleanup', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'caches');
  });

  it('deletes owned OfflinePlugin caches and preserves unrelated caches', async() => {
    const deleteCache = jest.fn(async() => true);
    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: {
        delete: deleteCache,
        keys: jest.fn(async() => [
          'soapbox:v1',
          'webpack-offline:optional',
          'soapbox-private-revocations-v1',
          'other-application',
        ]),
      },
    });

    await clearApplicationCacheStorage();

    expect(deleteCache.mock.calls).toEqual([
      ['soapbox:v1'],
      ['webpack-offline:optional'],
    ]);
  });

  it('reports a partial deletion so the purge tombstone remains resumable', async() => {
    const deleteCache = jest.fn(async() => false);
    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: {
        delete: deleteCache,
        keys: jest.fn(async() => ['soapbox:v1']),
      },
    });

    await expect(clearApplicationCacheStorage()).rejects.toThrow('APPLICATION_CACHE_CLEANUP_INCOMPLETE');
    expect(deleteCache).toHaveBeenCalledWith('soapbox:v1');
  });
});

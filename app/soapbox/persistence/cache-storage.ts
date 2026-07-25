const OFFLINE_CACHE_PREFIXES = ['soapbox', 'webpack-offline'];
const PROTECTED_CACHE_NAMES = new Set(['soapbox-private-revocations-v1']);

const clearApplicationCacheStorage = async(): Promise<void> => {
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  const owned = keys.filter(key =>
    !PROTECTED_CACHE_NAMES.has(key)
    && OFFLINE_CACHE_PREFIXES.some(prefix => key.toLowerCase().startsWith(prefix)));
  const outcomes = await Promise.all(owned.map(key => caches.delete(key)));
  if (outcomes.some(deleted => !deleted)) throw new Error('APPLICATION_CACHE_CLEANUP_INCOMPLETE');
};

export { clearApplicationCacheStorage, OFFLINE_CACHE_PREFIXES, PROTECTED_CACHE_NAMES };

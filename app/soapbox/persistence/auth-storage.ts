const AUTH_STORAGE_KEY_PATTERN = /^soapbox(?:@.*)?:auth$/;
const AUTH_SESSION_KEY_PATTERN = /^soapbox(?:@.*)?:auth:me$/;
const LEGACY_AUTH_KEYS = ['soapbox:auth:app', 'soapbox:auth:user'];

const readStoredJSON = (storage: Storage, key: string): unknown => {
  try {
    const raw = storage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    try {
      storage.removeItem(key);
    } catch {
      // Storage can be denied by browser policy.
    }
    return undefined;
  }
};

const writeStoredJSON = (storage: Storage, key: string, value: unknown): boolean => {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const removePersistedAccountCredentials = (accountUrl: string, accessToken?: string): void => {
  const localKeys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
    .filter((key): key is string => Boolean(key));

  for (const key of localKeys) {
    if (!AUTH_STORAGE_KEY_PATTERN.test(key)) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const auth = JSON.parse(raw);
      if (!auth || typeof auth !== 'object') throw new Error('INVALID_AUTH_STORAGE');
      if (auth.users && typeof auth.users === 'object') delete auth.users[accountUrl];
      if (auth.tokens && typeof auth.tokens === 'object') {
        for (const [token, value] of Object.entries<any>(auth.tokens)) {
          if (token === accessToken || value?.me === accountUrl) delete auth.tokens[token];
        }
      }
      if (auth.me === accountUrl) auth.me = null;
      try {
        localStorage.setItem(key, JSON.stringify(auth));
      } catch {
        // Fail closed if quota or storage denial prevents the sanitized write.
        localStorage.removeItem(key);
      }
    } catch {
      // Malformed credential authority is not recoverable as trusted state.
      localStorage.removeItem(key);
    }
  }

  for (const key of LEGACY_AUTH_KEYS) localStorage.removeItem(key);

  const sessionKeys = Array.from({ length: sessionStorage.length }, (_, index) => sessionStorage.key(index))
    .filter((key): key is string => Boolean(key));
  for (const key of sessionKeys) {
    if (AUTH_SESSION_KEY_PATTERN.test(key) && sessionStorage.getItem(key) === accountUrl) {
      sessionStorage.removeItem(key);
    }
  }
};

export {
  AUTH_SESSION_KEY_PATTERN,
  AUTH_STORAGE_KEY_PATTERN,
  LEGACY_AUTH_KEYS,
  readStoredJSON,
  removePersistedAccountCredentials,
  writeStoredJSON,
};

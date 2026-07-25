import {
  STORAGE_EVENT_KEY,
  installAccountPurgeListener,
  isValidMessage,
} from '../cross-tab';

describe('cross-tab purge protocol', () => {
  it('accepts a versioned, token-free purge message', () => {
    const message = {
      accountUrl: 'https://social.example/users/alice',
      generation: 2,
      source: 'another-tab',
      type: 'PURGE_ACCOUNT',
      version: 1,
    };

    expect(isValidMessage(message)).toBe(true);
    expect(JSON.stringify(message)).not.toContain('access_token');
  });

  it.each([
    null,
    {},
    { accountUrl: 'javascript:alert(1)', generation: 1, source: 'another-tab', type: 'PURGE_ACCOUNT', version: 1 },
    { accountUrl: 'https://social.example/users/alice', generation: 0, source: 'another-tab', type: 'PURGE_ACCOUNT', version: 1 },
    { accountUrl: 'https://social.example/users/alice', generation: 1, source: 'another-tab', type: 'OTHER', version: 1 },
    { accountUrl: 'https://social.example/users/alice', generation: 1, source: 'another-tab', type: 'PURGE_ACCOUNT', version: 2 },
  ])('rejects malformed or unsupported messages', value => {
    expect(isValidMessage(value)).toBe(false);
  });

  it('propagates a valid storage fallback event without credentials', () => {
    const listener = jest.fn();
    const uninstall = installAccountPurgeListener(listener);
    const message = {
      accountUrl: 'https://social.example/users/alice',
      generation: 3,
      source: 'another-tab',
      type: 'PURGE_ACCOUNT',
      version: 1,
    };

    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_EVENT_KEY,
      newValue: JSON.stringify(message),
    }));

    expect(listener).toHaveBeenCalledWith(message.accountUrl, message.generation);
    uninstall();
  });
});

import { removePersistedAccountCredentials } from '../auth-storage';

const accountUrl = 'https://social.example/users/alice';

describe('persisted auth credential cleanup', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('removes only the purged account from current auth storage', () => {
    localStorage.setItem('soapbox:auth', JSON.stringify({
      me: accountUrl,
      tokens: {
        aliceToken: { me: accountUrl },
        bobToken: { me: 'https://other.example/users/bob' },
      },
      users: {
        [accountUrl]: { access_token: 'aliceToken' },
        'https://other.example/users/bob': { access_token: 'bobToken' },
      },
    }));
    sessionStorage.setItem('soapbox:auth:me', accountUrl);

    removePersistedAccountCredentials(accountUrl, 'aliceToken');

    expect(JSON.parse(localStorage.getItem('soapbox:auth') || '{}')).toEqual({
      me: null,
      tokens: {
        bobToken: { me: 'https://other.example/users/bob' },
      },
      users: {
        'https://other.example/users/bob': { access_token: 'bobToken' },
      },
    });
    expect(sessionStorage.getItem('soapbox:auth:me')).toBeNull();
  });

  it('removes malformed credential storage rather than restoring it', () => {
    localStorage.setItem('soapbox:auth', '{bad-json');

    removePersistedAccountCredentials(accountUrl);

    expect(localStorage.getItem('soapbox:auth')).toBeNull();
  });

  it('falls back to deleting credential authority when a sanitized write exceeds quota', () => {
    localStorage.setItem('soapbox:auth', JSON.stringify({
      users: { [accountUrl]: { access_token: 'aliceToken' } },
    }));
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError');
    });

    try {
      removePersistedAccountCredentials(accountUrl, 'aliceToken');
      expect(localStorage.getItem('soapbox:auth')).toBeNull();
    } finally {
      setItem.mockRestore();
    }
  });

  it('deletes legacy credential duplicates during purge', () => {
    localStorage.setItem('soapbox:auth:app', 'app-secret');
    localStorage.setItem('soapbox:auth:user', 'user-secret');

    removePersistedAccountCredentials(accountUrl);

    expect(localStorage.getItem('soapbox:auth:app')).toBeNull();
    expect(localStorage.getItem('soapbox:auth:user')).toBeNull();
  });
});

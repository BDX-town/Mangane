import {
  createAccountScope,
  resolveScopedDestination,
  scopesEqual,
} from '../account-scope';

describe('account scope', () => {
  const alice = createAccountScope({
    accountId: 'alice',
    accountUrl: 'https://social.example/users/alice',
    instanceOrigin: 'https://social.example',
  });

  it('normalizes origins and allows only same-origin destinations', () => {
    expect(alice.instanceOrigin).toBe('https://social.example');
    expect(resolveScopedDestination(alice, '/api/v1/accounts').href)
      .toBe('https://social.example/api/v1/accounts');
    expect(() => resolveScopedDestination(alice, 'https://evil.example/private'))
      .toThrow('escapes the active account scope');
  });

  it('rejects credential-bearing and mismatched origins', () => {
    expect(() => createAccountScope({
      accountUrl: 'https://social.example/users/alice',
      instanceOrigin: 'https://other.example',
    })).toThrow('origins must match');
    expect(() => createAccountScope({
      instanceOrigin: 'https://alice:secret@social.example',
    })).toThrow('without credentials');
  });

  it('compares every authority-bearing scope field', () => {
    expect(scopesEqual(alice, { ...alice })).toBe(true);
    expect(scopesEqual(alice, { ...alice, accountId: 'bob' })).toBe(false);
  });
});

import { createAccountScope } from 'soapbox/domain/account-scope';

import { LegacyAccountRepository } from '../legacy-account-repository';
import { LegacyCapabilityAdapter } from '../legacy-capability-adapter';

describe('legacy account repository', () => {
  const scope = createAccountScope({
    accountId: 'alice',
    accountUrl: 'https://social.example/users/alice',
    instanceOrigin: 'https://social.example',
  });
  const account = { acct: 'tiger', id: '123' };
  const gateway = {
    fetchByUsername: jest.fn(async() => account),
    lookup: jest.fn(async() => account),
    scope,
    search: jest.fn(async() => [account]),
  };

  beforeEach(() => jest.clearAllMocks());

  it('uses the direct adapter for authenticated Pleroma/Akkoma behavior', async() => {
    const repository = new LegacyAccountRepository(
      gateway,
      new LegacyCapabilityAdapter({ accountByUsername: true, accountLookup: true }),
      () => true,
    );
    await expect(repository.findByUsername({ authenticated: true, scope, username: 'tiger' }))
      .resolves.toEqual(account);
    expect(gateway.fetchByUsername).toHaveBeenCalledWith('tiger', undefined);
    expect(gateway.lookup).not.toHaveBeenCalled();
  });

  it('uses lookup for Mastodon-compatible behavior and search as a bounded fallback', async() => {
    const lookup = new LegacyAccountRepository(
      gateway,
      new LegacyCapabilityAdapter({ accountByUsername: false, accountLookup: true }),
      () => true,
    );
    await lookup.findByUsername({ authenticated: false, scope, username: 'tiger' });
    expect(gateway.lookup).toHaveBeenCalled();

    const search = new LegacyAccountRepository(
      gateway,
      new LegacyCapabilityAdapter({ accountByUsername: false, accountLookup: false }),
      () => true,
    );
    await search.findByUsername({ authenticated: false, scope, username: 'tiger' });
    expect(gateway.search).toHaveBeenCalled();
  });

  it('rejects scope confusion, malformed responses, and invalid identifiers', async() => {
    const repository = new LegacyAccountRepository(
      { ...gateway, fetchByUsername: async() => ({ id: '123' }) },
      new LegacyCapabilityAdapter({ accountByUsername: true, accountLookup: false }),
      () => true,
    );
    const otherScope = createAccountScope({ accountId: 'bob', instanceOrigin: 'https://social.example' });
    await expect(repository.findByUsername({ authenticated: true, scope: otherScope, username: 'tiger' }))
      .rejects.toMatchObject({ kind: 'forbidden' });
    await expect(repository.findByUsername({ authenticated: true, scope, username: 'tiger' }))
      .rejects.toMatchObject({ kind: 'protocol' });
    await expect(repository.findByUsername({ authenticated: true, scope, username: '\u0000' }))
      .rejects.toMatchObject({ kind: 'validation' });
  });

  it('normalizes offline transport errors without retaining payloads', async() => {
    const repository = new LegacyAccountRepository(
      { ...gateway, fetchByUsername: async() => Promise.reject(new Error('Network Error')) },
      new LegacyCapabilityAdapter({ accountByUsername: true, accountLookup: false }),
      () => false,
    );
    await expect(repository.findByUsername({ authenticated: true, scope, username: 'tiger' }))
      .rejects.toMatchObject({ kind: 'offline', retryable: true });
  });
});

import type { AccountScope } from './account-scope';

type RemoteAccount = Readonly<Record<string, unknown> & {
  acct: string;
  id: string;
}>;

type FindAccountByUsernameRequest = Readonly<{
  authenticated: boolean;
  scope: AccountScope;
  signal?: AbortSignal;
  username: string;
}>;

interface AccountRepository {
  findByUsername(request: FindAccountByUsernameRequest): Promise<RemoteAccount>;
}

const parseRemoteAccount = (value: unknown): RemoteAccount => {
  if (!value || typeof value !== 'object') throw new TypeError('Account response must be an object.');
  const account = value as Record<string, unknown>;
  if (typeof account.id !== 'string' || !account.id || typeof account.acct !== 'string' || !account.acct) {
    throw new TypeError('Account response is missing its stable identity.');
  }
  return account as RemoteAccount;
};

export { parseRemoteAccount };

export type {
  AccountRepository,
  FindAccountByUsernameRequest,
  RemoteAccount,
};

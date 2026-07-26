import type { QueryHandler } from 'soapbox/application/contracts';
import type { AccountRepository, RemoteAccount } from 'soapbox/domain/account-repository';

type FindAccountByUsernameQuery = Readonly<{
  authenticated: boolean;
  username: string;
}>;

class FindAccountByUsername implements QueryHandler<FindAccountByUsernameQuery, RemoteAccount> {

  constructor(private readonly accounts: AccountRepository) {}

  execute(
    query: FindAccountByUsernameQuery,
    context: Parameters<QueryHandler<FindAccountByUsernameQuery, RemoteAccount>['execute']>[1],
  ): Promise<RemoteAccount> {
    return this.accounts.findByUsername({
      authenticated: query.authenticated,
      scope: context.scope,
      signal: context.signal,
      username: query.username,
    });
  }

}

export { FindAccountByUsername };
export type { FindAccountByUsernameQuery };

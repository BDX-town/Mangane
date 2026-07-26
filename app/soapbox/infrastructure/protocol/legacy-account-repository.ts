import { parseRemoteAccount } from 'soapbox/domain/account-repository';
import { scopesEqual } from 'soapbox/domain/account-scope';
import { ApplicationError, normalizeTransportError } from 'soapbox/domain/application-error';

import type {
  AccountRepository,
  FindAccountByUsernameRequest,
  RemoteAccount,
} from 'soapbox/domain/account-repository';
import type { AccountScope } from 'soapbox/domain/account-scope';
import type { ProtocolCapabilityContract } from 'soapbox/domain/protocol-capability';

type LegacyAccountGateway = Readonly<{
  fetchByUsername(username: string, signal?: AbortSignal): Promise<unknown>;
  lookup(username: string, signal?: AbortSignal): Promise<unknown>;
  scope: AccountScope;
  search(username: string, signal?: AbortSignal): Promise<unknown[]>;
}>;

const normalizeUsername = (username: string): string => {
  const normalized = username.trim();
  const hasControlCharacter = Array.from(normalized)
    .some(character => character.charCodeAt(0) <= 0x1f || character.charCodeAt(0) === 0x7f);
  if (!normalized || normalized.length > 255 || hasControlCharacter) {
    throw new ApplicationError({ kind: 'validation', message: 'The account name is invalid.' });
  }
  return normalized;
};

class LegacyAccountRepository implements AccountRepository {

  constructor(
    private readonly gateway: LegacyAccountGateway,
    private readonly capabilities: ProtocolCapabilityContract,
    private readonly online: () => boolean,
  ) {}

  async findByUsername({
    authenticated,
    scope,
    signal,
    username,
  }: FindAccountByUsernameRequest): Promise<RemoteAccount> {
    if (!scopesEqual(scope, this.gateway.scope)) {
      throw new ApplicationError({
        kind: 'forbidden',
        message: 'The account repository is bound to another account scope.',
      });
    }
    const normalized = normalizeUsername(username);
    const direct = this.capabilities.resolve('account.fetch-by-username', scope);
    const lookup = this.capabilities.resolve('account.lookup', scope);
    try {
      if (direct.state === 'supported' && (authenticated || lookup.state !== 'supported')) {
        return parseRemoteAccount(await this.gateway.fetchByUsername(normalized, signal));
      }
      if (lookup.state === 'supported') {
        return parseRemoteAccount(await this.gateway.lookup(normalized, signal));
      }
      const candidates = await this.gateway.search(normalized, signal);
      const match = candidates.map(parseRemoteAccount).find(account => account.acct === normalized);
      if (!match) {
        throw new ApplicationError({ kind: 'protocol', message: 'The account was not found.' });
      }
      return match;
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      if (error instanceof TypeError) {
        throw new ApplicationError({ kind: 'protocol', message: 'The server returned an invalid account.' });
      }
      throw normalizeTransportError(error, { online: this.online() });
    }
  }

}

export {
  LegacyAccountRepository,
  normalizeUsername,
};

export type { LegacyAccountGateway };

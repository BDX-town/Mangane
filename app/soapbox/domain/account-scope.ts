type InstanceOrigin = string & { readonly __instanceOrigin: unique symbol };

type AccountScope = Readonly<{
  accountId: string | null;
  accountUrl: string | null;
  instanceOrigin: InstanceOrigin;
}>;

type AccountScopeInput = {
  accountId?: string | null;
  accountUrl?: string | null;
  instanceOrigin: string;
};

const normalizeInstanceOrigin = (value: string): InstanceOrigin => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError('Account scope requires a valid instance URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new TypeError('Account scope requires an HTTP(S) instance origin without credentials.');
  }
  return parsed.origin as InstanceOrigin;
};

const createAccountScope = ({
  accountId = null,
  accountUrl = null,
  instanceOrigin,
}: AccountScopeInput): AccountScope => {
  const normalizedOrigin = normalizeInstanceOrigin(instanceOrigin);
  if (accountUrl && normalizeInstanceOrigin(accountUrl) !== normalizedOrigin) {
    throw new TypeError('Account and instance origins must match.');
  }
  return Object.freeze({
    accountId,
    accountUrl,
    instanceOrigin: normalizedOrigin,
  });
};

const scopesEqual = (left: AccountScope, right: AccountScope): boolean => (
  left.accountId === right.accountId
  && left.accountUrl === right.accountUrl
  && left.instanceOrigin === right.instanceOrigin
);

const resolveScopedDestination = (scope: AccountScope, destination: string): URL => {
  let resolved: URL;
  try {
    resolved = new URL(destination, `${scope.instanceOrigin}/`);
  } catch {
    throw new TypeError('Request destination is invalid.');
  }
  if (resolved.origin !== scope.instanceOrigin || !['http:', 'https:'].includes(resolved.protocol)) {
    throw new TypeError('Request destination escapes the active account scope.');
  }
  return resolved;
};

export {
  createAccountScope,
  normalizeInstanceOrigin,
  resolveScopedDestination,
  scopesEqual,
};

export type {
  AccountScope,
  AccountScopeInput,
  InstanceOrigin,
};

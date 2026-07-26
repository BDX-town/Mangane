import type { AccountScope } from './account-scope';

type ProtocolCapability =
  | 'account.fetch-by-username'
  | 'account.lookup';

type CapabilityState = 'supported' | 'unsupported' | 'unknown' | 'failed';

type CapabilityDecision = Readonly<{
  capability: ProtocolCapability;
  state: CapabilityState;
  reason: string;
}>;

interface ProtocolCapabilityContract {
  resolve(capability: ProtocolCapability, scope: AccountScope): CapabilityDecision;
}

export type {
  CapabilityDecision,
  CapabilityState,
  ProtocolCapability,
  ProtocolCapabilityContract,
};

import type { AccountScope } from 'soapbox/domain/account-scope';
import type {
  CapabilityDecision,
  ProtocolCapability,
  ProtocolCapabilityContract,
} from 'soapbox/domain/protocol-capability';

type LegacyAccountFeatures = Readonly<{
  accountByUsername: boolean;
  accountLookup: boolean;
}>;

class LegacyCapabilityAdapter implements ProtocolCapabilityContract {

  constructor(private readonly features: LegacyAccountFeatures) {}

  resolve(capability: ProtocolCapability, _scope: AccountScope): CapabilityDecision {
    const supported = capability === 'account.fetch-by-username'
      ? this.features.accountByUsername
      : this.features.accountLookup;
    return {
      capability,
      state: supported ? 'supported' : 'unsupported',
      reason: supported
        ? 'Verified by normalized legacy instance metadata.'
        : 'Not present in normalized legacy instance metadata.',
    };
  }

}

export { LegacyCapabilityAdapter };
export type { LegacyAccountFeatures };

import { getSoapboxConfig } from'soapbox/actions/soapbox';

export const displayFqn = state => {
  const soapbox = getSoapboxConfig(state);
  return soapbox.get('displayFqn');
};

export const federationRestrictionsDisclosed = state => {
  return state.hasIn(['instance', 'pleroma', 'metadata', 'federation', 'mrf_policies']);
};

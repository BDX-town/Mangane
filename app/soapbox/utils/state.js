import { getSoapboxConfig } from'soapbox/actions/soapbox';

export const displayFqn = state => {
  const soapbox = getSoapboxConfig(state);
  return soapbox.get('displayFqn');
};

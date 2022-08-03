import { getSoapboxConfig } from 'soapbox/actions/soapbox';

import type { AdProvider } from '.';

/** Provides ads from Soapbox Config. */
const SoapboxConfigAdProvider: AdProvider = {
  getAds: async(getState) => {
    const state = getState();
    const soapboxConfig = getSoapboxConfig(state);
    return soapboxConfig.ads.toArray();
  },
};

export default SoapboxConfigAdProvider;

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { normalizeCard } from 'soapbox/normalizers';

import type { AdProvider } from '.';

/** Rumble ad API entity. */
interface RumbleAd {
  type: number,
  impression: string,
  click: string,
  asset: string,
  expires: number,
}

/** Response from Rumble ad server. */
interface RumbleApiResponse {
  count: number,
  ads: RumbleAd[],
}

/** Provides ads from Soapbox Config. */
const RumbleAdProvider: AdProvider = {
  getAds: async(getState) => {
    const state = getState();
    const soapboxConfig = getSoapboxConfig(state);
    const endpoint = soapboxConfig.extensions.getIn(['ads', 'endpoint']) as string | undefined;

    if (endpoint) {
      const response = await fetch(endpoint);
      const data = await response.json() as RumbleApiResponse;
      return data.ads.map(item => ({
        impression: item.impression,
        card: normalizeCard({
          type: item.type === 1 ? 'Link' : 'Rich',
          image: item.asset,
          url: item.click,
        }),
      }));
    } else {
      return [];
    }
  },
};

export default RumbleAdProvider;

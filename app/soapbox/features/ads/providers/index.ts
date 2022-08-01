import type { RootState } from 'soapbox/store';
import type { Card } from 'soapbox/types/entities';

/** Ad server implementation. */
interface AdProvider {
  getAds(getState: () => RootState): Promise<Ad[]>,
}

/** Entity representing an advertisement. */
interface Ad {
  /** Ad data in Card (OEmbed-ish) format. */
  card: Card,
  /** Impression URL to fetch when displaying the ad. */
  impression?: string,
}

export type { Ad, AdProvider };

/**
 * FediDB API client
 * @module soapbox/api/fedidb
 * @see https://fedidb.com/resources/api-docs
 */

import axios from 'axios';

const FEDIDB_API_BASE = 'https://api.fedidb.org/v1';

/** Software slugs that Mangane supports */
export const SUPPORTED_SOFTWARE_SLUGS = [
  'mastodon',
  'pleroma',
  'akkoma',
  'pixelfed',
  'mitra',
  'gotosocial',
  'hometown',
  'glitch',  // glitch-soc is a mastodon fork
  'fedibird', // fedibird is a mastodon fork
] as const;

export type SupportedSoftwareSlug = typeof SUPPORTED_SOFTWARE_SLUGS[number];

export interface FediDBServer {
  id: number;
  domain: string;
  open_registration: boolean;
  description: string | null;
  banner_url: string | null;
  location: {
    city: string | null;
    country: string | null;
  };
  software: {
    id: number;
    name: string;
    url: string;
    version: string;
    slug: string;
  };
  stats: {
    status_count: number;
    user_count: number;
    monthly_active_users: number;
  };
  first_seen_at: string;
  last_seen_at: string;
}

export interface FediDBPopularAccount {
  id: number;
  rank: number;
  username: string;
  name: string;
  domain: string;
  account_url: string;
  avatar_url: string;
  following_count: number;
  followers_count: number;
  status_count: number;
  webfinger: string;
  bio: string;
  account_created_at: string;
  last_fetched_at: string;
}

export interface FediDBSoftware {
  id: number;
  url: string;
  name: string;
  license: string | null;
  website: string | null;
  user_count: number;
  description: string | null;
  details_url: string;
  source_repo: string | null;
  status_count: number;
  instance_count: number;
  latest_version: { version: string; published_at: string } | null;
  monthly_active_users: number;
}

interface FediDBServersResponse {
  data: FediDBServer[];
  links: {
    next: string | null;
  };
  meta: {
    path: string;
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
  };
}

interface FediDBPopularAccountsResponse {
  data: FediDBPopularAccount[];
}

const fedidbClient = axios.create({
  baseURL: FEDIDB_API_BASE,
  timeout: 10000,
});

/**
 * Fetch servers from FediDB, filtered to only supported software.
 * Returns up to `limit` servers sorted by user count (default from API).
 */
export const fetchServers = async(limit = 40): Promise<FediDBServer[]> => {
  try {
    const { data } = await fedidbClient.get<FediDBServersResponse>('/servers', {
      params: { limit },
    });
    // Filter to only servers running software that Mangane supports
    return data.data.filter(server =>
      SUPPORTED_SOFTWARE_SLUGS.includes(server.software.slug as SupportedSoftwareSlug),
    );
  } catch (error) {
    console.error('FediDB: Failed to fetch servers', error);
    return [];
  }
};

/**
 * Fetch popular accounts across the fediverse.
 */
export const fetchPopularAccounts = async(): Promise<FediDBPopularAccount[]> => {
  try {
    const { data } = await fedidbClient.get<FediDBPopularAccountsResponse>('/popular-accounts');
    return data.data;
  } catch (error) {
    console.error('FediDB: Failed to fetch popular accounts', error);
    return [];
  }
};

/**
 * Fetch information about a specific server by domain.
 */
export const fetchServerByDomain = async(domain: string): Promise<FediDBServer | null> => {
  try {
    const { data } = await fedidbClient.get<FediDBServer>(`/server/domain/${domain}`);
    return data;
  } catch (error) {
    console.error(`FediDB: Failed to fetch server ${domain}`, error);
    return null;
  }
};

export interface SoftwareValidationResult {
  /** Whether the software is supported by Mangane */
  supported: boolean;
  /** The software name if detected */
  softwareName: string | null;
  /** Whether the server was found in FediDB at all */
  found: boolean;
}

/**
 * Check if a server's software is supported by Mangane.
 * Returns validation info. If the server isn't in FediDB, returns found=false
 * and supported=true (benefit of the doubt for unknown/new instances).
 */
export const validateServerSoftware = async(domain: string): Promise<SoftwareValidationResult> => {
  try {
    const { data } = await fedidbClient.get<FediDBServer>(`/server/domain/${domain}`);
    const slug = data.software?.slug;
    const name = data.software?.name || null;
    const supported = slug
      ? SUPPORTED_SOFTWARE_SLUGS.includes(slug as SupportedSoftwareSlug)
      : true; // If no slug info, give benefit of the doubt
    return { supported, softwareName: name, found: true };
  } catch (error) {
    // Server not in FediDB — allow it through (could be new/small)
    return { supported: true, softwareName: null, found: false };
  }
};

/**
 * Fetch all software entries from FediDB.
 */
export const fetchSoftwareList = async(limit = 40): Promise<FediDBSoftware[]> => {
  try {
    const { data } = await fedidbClient.get<FediDBSoftware[]>('/software', {
      params: { limit },
    });
    return data;
  } catch (error) {
    console.error('FediDB: Failed to fetch software list', error);
    return [];
  }
};

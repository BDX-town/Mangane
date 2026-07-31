/**
 * Phase 8B-4 — Wikidata entity provider.
 *
 * Bounded provider client for Wikidata entity lookup.
 * Uses the Wikidata API for:
 * - Entity lookup by Q-identifier
 * - Label/alias search constrained by language and type
 * - Multilingual labels and descriptions
 * - Official website and sameAs links
 * - Redirects
 *
 * Does NOT:
 * - Send private data (drafts, feeds, tokens, reading history)
 * - Use broad SPARQL queries (only bounded entity lookups)
 * - Claim Wikidata is globally authoritative
 * - Auto-merge based on name alone
 *
 * Requires attribution: "Data from Wikidata, available under CC0"
 */

import {
  assessProviderHealth,
  CircuitBreaker,
  computeBackoffDelay,
  ConcurrencyLimiter,
  ProviderCache,
  RequestCoalescer,
} from './provider-client';

import type { ProviderHealth } from './provider-client';
import type {
  CanonicalEntityKind,
  EntityCandidate,
  EntityEvidence,
  EntityProviderReference,
  EntityResolverResult,
} from 'soapbox/domain/entity-resolution';

// ─── Configuration ───────────────────────────────────────────────────────────

const WIKIDATA_API_URL = 'https://www.wikidata.org/w/api.php';
const MAX_RESPONSE_SIZE = 512 * 1024; // 512KB
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;
const MAX_SEARCH_RESULTS = 5;

// ─── Infrastructure instances ────────────────────────────────────────────────

const circuitBreaker = new CircuitBreaker({ failureThreshold: 5, resetTimeoutMs: 120_000 });
const cache = new ProviderCache<WikidataEntityData>({ positiveTtlMs: 24 * 60 * 60 * 1000, negativeTtlMs: 2 * 60 * 60 * 1000 });
const coalescer = new RequestCoalescer<WikidataEntityData | null>();
const searchCoalescer = new RequestCoalescer<WikidataSearchResult[]>();
const limiter = new ConcurrencyLimiter(2); // Max 2 concurrent Wikidata requests

// ─── Types ───────────────────────────────────────────────────────────────────

interface WikidataEntityData {
  id: string;
  labels: Record<string, string>;
  descriptions: Record<string, string>;
  aliases: Record<string, string[]>;
  claims: Record<string, WikidataClaim[]>;
  sitelinks: Record<string, { title: string; url?: string }>;
}

interface WikidataClaim {
  mainsnak: {
    datatype: string;
    datavalue?: {
      type: string;
      value: unknown;
    };
  };
}

interface WikidataSearchResult {
  id: string;
  label: string;
  description?: string;
  url?: string;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Look up a Wikidata entity by Q-identifier.
 * Returns normalized entity data or null if not found.
 *
 * @param qid - Wikidata Q-identifier (e.g., "Q42" for Douglas Adams)
 * @param language - Preferred language code (e.g., "en")
 * @param signal - AbortSignal for cancellation
 */
export async function lookupEntity(
  qid: string,
  language: string = 'en',
  signal?: AbortSignal,
): Promise<WikidataEntityData | null> {
  if (!isValidQid(qid)) return null;
  if (!circuitBreaker.canExecute()) return null;

  const cacheKey = `wikidata:entity:${qid}:${language}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached.value;

  return coalescer.execute(cacheKey, async() => {
    return executeWithRetry(async() => {
      await limiter.acquire();
      try {
        const params = new URLSearchParams({
          action: 'wbgetentities',
          ids: qid,
          languages: language,
          props: 'labels|descriptions|aliases|claims|sitelinks',
          format: 'json',
          origin: '*',
        });

        const response = await fetchWithTimeout(
          `${WIKIDATA_API_URL}?${params.toString()}`,
          signal,
        );

        if (!response) {
          cache.set(cacheKey, null, 'wikidata');
          return null;
        }

        const entity = parseEntityResponse(response, qid, language);
        cache.set(cacheKey, entity, 'wikidata');
        circuitBreaker.recordSuccess();
        return entity;
      } finally {
        limiter.release();
      }
    }, signal);
  });
}

/**
 * Search Wikidata for entities matching a label.
 * Constrained by language and optional type.
 *
 * @param query - Search text (label or alias)
 * @param language - Language to search in
 * @param signal - AbortSignal for cancellation
 */
export async function searchEntities(
  query: string,
  language: string = 'en',
  signal?: AbortSignal,
): Promise<WikidataSearchResult[]> {
  if (!query || query.length < 2 || query.length > 200) return [];
  if (!circuitBreaker.canExecute()) return [];

  const cacheKey = `wikidata:search:${language}:${query.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached.value as unknown as WikidataSearchResult[] || [];

  return searchCoalescer.execute(cacheKey, async() => {
    return executeWithRetry(async() => {
      await limiter.acquire();
      try {
        const params = new URLSearchParams({
          action: 'wbsearchentities',
          search: query,
          language,
          limit: String(MAX_SEARCH_RESULTS),
          format: 'json',
          origin: '*',
        });

        const response = await fetchWithTimeout(
          `${WIKIDATA_API_URL}?${params.toString()}`,
          signal,
        );

        if (!response) {
          cache.set(cacheKey, null, 'wikidata');
          return [];
        }

        const results = parseSearchResponse(response);
        cache.set(cacheKey, results as any, 'wikidata');
        circuitBreaker.recordSuccess();
        return results;
      } finally {
        limiter.release();
      }
    }, signal) || [];
  }) as unknown as WikidataSearchResult[];
}

/**
 * Convert a Wikidata entity into EntityCandidate format.
 */
export function toEntityCandidate(
  data: WikidataEntityData,
  language: string = 'en',
): EntityCandidate {
  const label = data.labels[language] || Object.values(data.labels)[0] || data.id;
  const description = data.descriptions[language] || Object.values(data.descriptions)[0] || '';
  const aliases = data.aliases[language] || [];
  const kind = inferEntityKind(data);
  const officialUrl = extractOfficialWebsite(data);

  const providerRef: EntityProviderReference = {
    provider: 'wikidata',
    providerId: data.id,
    canonicalUri: `https://www.wikidata.org/wiki/${data.id}`,
    observedAt: new Date().toISOString(),
    evidenceIds: [],
  };

  return {
    candidateKey: `wikidata:${data.id}`,
    kind,
    label,
    canonicalUri: `https://www.wikidata.org/wiki/${data.id}`,
    providerReferences: [providerRef],
    evidenceIds: [],
    features: {
      description,
      aliases: aliases.join(', '),
      officialUrl: officialUrl || '',
      wikidataId: data.id,
      hasDescription: description.length > 0,
      aliasCount: aliases.length,
    },
  };
}

/**
 * Build an EntityResolverResult from Wikidata search results.
 */
export function buildResolverResult(
  searchResults: WikidataSearchResult[],
  language: string = 'en',
): EntityResolverResult {
  const candidates: EntityCandidate[] = searchResults.map(r => ({
    candidateKey: `wikidata:${r.id}`,
    kind: 'other' as CanonicalEntityKind,
    label: r.label,
    canonicalUri: `https://www.wikidata.org/wiki/${r.id}`,
    providerReferences: [{
      provider: 'wikidata' as const,
      providerId: r.id,
      canonicalUri: `https://www.wikidata.org/wiki/${r.id}`,
      observedAt: new Date().toISOString(),
      evidenceIds: [],
    }],
    evidenceIds: [],
    features: {
      description: r.description || '',
      wikidataId: r.id,
    },
  }));

  const evidence: EntityEvidence[] = candidates.length > 0 ? [{
    evidenceId: `ev-wikidata-search-${Date.now()}`,
    kind: 'provider-lookup',
    provider: 'wikidata',
    description: `Wikidata search returned ${candidates.length} candidates`,
    observedAt: new Date().toISOString(),
    weight: 0.6,
  }] : [];

  return {
    candidates,
    evidence,
    providerHealth: getHealth(),
  };
}

/** Get current provider health status. */
export function getHealth(): ProviderHealth {
  return assessProviderHealth(circuitBreaker);
}

/** Reset provider state (for testing). */
export function resetProvider(): void {
  circuitBreaker.reset();
  cache.clear();
}

/** Get diagnostics. */
export function getDiagnostics(): {
  health: ProviderHealth;
  cacheSize: number;
  pendingRequests: number;
  } {
  return {
    health: getHealth(),
    cacheSize: cache.size,
    pendingRequests: coalescer.pendingCount,
  };
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function isValidQid(qid: string): boolean {
  return /^Q\d{1,10}$/.test(qid);
}

async function fetchWithTimeout(
  url: string,
  signal?: AbortSignal,
): Promise<unknown | null> {
  // Validate URL is HTTPS Wikidata
  if (!url.startsWith('https://www.wikidata.org/')) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Link external signal
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      credentials: 'omit', // Never send cookies
      referrerPolicy: 'no-referrer', // No referrer leakage
    });

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited — record failure with Retry-After
        circuitBreaker.recordFailure();
        return null;
      }
      if (response.status >= 500) {
        circuitBreaker.recordFailure();
        return null;
      }
      return null;
    }

    // Bound response size
    const text = await response.text();
    if (text.length > MAX_RESPONSE_SIZE) {
      return null; // Response too large
    }

    return JSON.parse(text);
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return null; // Cancelled
    }
    circuitBreaker.recordFailure();
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  signal?: AbortSignal,
  maxRetries: number = MAX_RETRIES,
): Promise<T | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal?.aborted) return null;
    if (!circuitBreaker.canExecute()) return null;

    try {
      return await fn();
    } catch {
      if (attempt < maxRetries) {
        const delay = computeBackoffDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return null;
}

function parseEntityResponse(response: unknown, qid: string, language: string): WikidataEntityData | null {
  if (!response || typeof response !== 'object') return null;
  const data = (response as any).entities?.[qid];
  if (!data || data.missing !== undefined) return null;

  return {
    id: data.id || qid,
    labels: extractLangMap(data.labels),
    descriptions: extractLangMap(data.descriptions),
    aliases: extractAliasMap(data.aliases),
    claims: data.claims || {},
    sitelinks: data.sitelinks || {},
  };
}

function parseSearchResponse(response: unknown): WikidataSearchResult[] {
  if (!response || typeof response !== 'object') return [];
  const search = (response as any).search;
  if (!Array.isArray(search)) return [];

  return search.slice(0, MAX_SEARCH_RESULTS).map((item: any) => ({
    id: String(item.id || ''),
    label: String(item.label || item.display?.label?.value || ''),
    description: item.description || item.display?.description?.value || undefined,
    url: item.url ? `https://www.wikidata.org/wiki/${item.id}` : undefined,
  })).filter((r: WikidataSearchResult) => r.id && r.label);
}

function extractLangMap(data: unknown): Record<string, string> {
  if (!data || typeof data !== 'object') return {};
  const result: Record<string, string> = {};
  for (const [lang, val] of Object.entries(data as Record<string, any>)) {
    if (val && typeof val.value === 'string') {
      result[lang] = val.value;
    }
  }
  return result;
}

function extractAliasMap(data: unknown): Record<string, string[]> {
  if (!data || typeof data !== 'object') return {};
  const result: Record<string, string[]> = {};
  for (const [lang, vals] of Object.entries(data as Record<string, any>)) {
    if (Array.isArray(vals)) {
      result[lang] = vals.map((v: any) => v.value).filter(Boolean).slice(0, 20);
    }
  }
  return result;
}

/** Infer entity kind from Wikidata claims (instance-of P31). */
function inferEntityKind(data: WikidataEntityData): CanonicalEntityKind {
  const instanceOf = data.claims.P31;
  if (!instanceOf || instanceOf.length === 0) return 'other';

  const firstValue = instanceOf[0]?.mainsnak?.datavalue?.value;
  if (!firstValue || typeof firstValue !== 'object') return 'other';
  const qid = (firstValue as any)?.id || (firstValue as any)?.['numeric-id'];

  // Common Wikidata type mappings
  const typeMap: Record<string, CanonicalEntityKind> = {
    'Q5': 'person',           // human
    'Q4830453': 'organization', // business
    'Q43229': 'organization', // organization
    'Q7889': 'work',          // video game
    'Q11424': 'work',         // film
    'Q7725634': 'work',       // literary work
    'Q515': 'place',          // city
    'Q6256': 'place',         // country
    'Q1656682': 'event',      // event
    'Q215380': 'music-artist', // musical group
    'Q639669': 'music-artist', // musician
    'Q847017': 'sports-team', // sports club
  };

  const mappedQid = typeof qid === 'string' ? qid : `Q${qid}`;
  return typeMap[mappedQid] || 'other';
}

/** Extract official website from claims (P856). */
function extractOfficialWebsite(data: WikidataEntityData): string | null {
  const website = data.claims.P856;
  if (!website || website.length === 0) return null;
  const value = website[0]?.mainsnak?.datavalue?.value;
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}

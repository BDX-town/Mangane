/**
 * Phase 8B-4 — DBpedia entity provider.
 *
 * Bounded provider client for DBpedia Lookup API.
 * Uses the DBpedia Lookup endpoint for:
 * - Label-based entity search
 * - Resource URI lookup
 * - Multilingual labels and abstracts
 * - Type classification
 * - Cross-links to Wikidata
 *
 * Does NOT use SPARQL (too broad, too expensive, too unpredictable).
 * Uses only the bounded Lookup API.
 *
 * Requires attribution: "Data from DBpedia, available under CC BY-SA 3.0"
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

const DBPEDIA_LOOKUP_URL = 'https://lookup.dbpedia.org/api/search';
const MAX_RESPONSE_SIZE = 256 * 1024; // 256KB
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_RETRIES = 2;
const MAX_RESULTS = 5;

// ─── Infrastructure ──────────────────────────────────────────────────────────

const circuitBreaker = new CircuitBreaker({ failureThreshold: 4, resetTimeoutMs: 90_000 });
const cache = new ProviderCache<DBpediaResult[]>({ positiveTtlMs: 48 * 60 * 60 * 1000, negativeTtlMs: 4 * 60 * 60 * 1000 });
const coalescer = new RequestCoalescer<DBpediaResult[]>();
const limiter = new ConcurrencyLimiter(2);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DBpediaResult {
  resource: string; // DBpedia resource URI
  label: string;
  description: string;
  type: string[];
  redirects: string[];
  refCount: number;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Search DBpedia for entities matching a query.
 *
 * @param query - Search text (label)
 * @param language - Language code (default: "en")
 * @param signal - AbortSignal for cancellation
 */
export async function searchEntities(
  query: string,
  language: string = 'en',
  signal?: AbortSignal,
): Promise<DBpediaResult[]> {
  if (!query || query.length < 2 || query.length > 200) return [];
  if (!circuitBreaker.canExecute()) return [];

  const cacheKey = `dbpedia:search:${language}:${query.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached.value || [];

  return coalescer.execute(cacheKey, async() => {
    return executeWithRetry(async() => {
      await limiter.acquire();
      try {
        const params = new URLSearchParams({
          query,
          format: 'json',
          maxResults: String(MAX_RESULTS),
        });

        const url = `${DBPEDIA_LOOKUP_URL}?${params.toString()}`;
        const response = await fetchWithTimeout(url, signal);

        if (!response) {
          cache.set(cacheKey, null, 'dbpedia');
          return [];
        }

        const results = parseSearchResponse(response);
        cache.set(cacheKey, results, 'dbpedia');
        circuitBreaker.recordSuccess();
        return results;
      } finally {
        limiter.release();
      }
    }, signal) || [];
  });
}

/**
 * Convert DBpedia results to EntityCandidate format.
 */
export function toEntityCandidates(results: DBpediaResult[]): EntityCandidate[] {
  return results.map(r => {
    const kind = inferKindFromTypes(r.type);
    const providerRef: EntityProviderReference = {
      provider: 'dbpedia',
      providerId: r.resource,
      canonicalUri: r.resource,
      observedAt: new Date().toISOString(),
      evidenceIds: [],
    };

    return {
      candidateKey: `dbpedia:${r.resource}`,
      kind,
      label: r.label,
      canonicalUri: r.resource,
      providerReferences: [providerRef],
      evidenceIds: [],
      features: {
        description: r.description,
        refCount: r.refCount,
        typeCount: r.type.length,
        hasRedirects: r.redirects.length > 0,
        dbpediaResource: r.resource,
      },
    };
  });
}

/**
 * Build an EntityResolverResult from DBpedia search.
 */
export function buildResolverResult(results: DBpediaResult[]): EntityResolverResult {
  const candidates = toEntityCandidates(results);

  const evidence: EntityEvidence[] = candidates.length > 0 ? [{
    evidenceId: `ev-dbpedia-search-${Date.now()}`,
    kind: 'provider-lookup',
    provider: 'dbpedia',
    description: `DBpedia lookup returned ${candidates.length} candidates`,
    observedAt: new Date().toISOString(),
    weight: 0.5,
  }] : [];

  return {
    candidates,
    evidence,
    providerHealth: getHealth(),
  };
}

/** Get current provider health. */
export function getHealth(): ProviderHealth {
  return assessProviderHealth(circuitBreaker);
}

/** Reset for testing. */
export function resetProvider(): void {
  circuitBreaker.reset();
  cache.clear();
}

/** Diagnostics. */
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

// ─── Internal ────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<unknown | null> {
  if (!url.startsWith('https://lookup.dbpedia.org/') && !url.startsWith('https://dbpedia.org/')) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });

    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) {
        circuitBreaker.recordFailure();
      }
      return null;
    }

    const text = await response.text();
    if (text.length > MAX_RESPONSE_SIZE) return null;
    return JSON.parse(text);
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') return null;
    circuitBreaker.recordFailure();
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  signal?: AbortSignal,
): Promise<T | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (signal?.aborted) return null;
    if (!circuitBreaker.canExecute()) return null;
    try {
      return await fn();
    } catch {
      if (attempt < MAX_RETRIES) {
        const delay = computeBackoffDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return null;
}

function parseSearchResponse(response: unknown): DBpediaResult[] {
  if (!response || typeof response !== 'object') return [];
  const docs = (response as any).docs || (response as any).results;
  if (!Array.isArray(docs)) return [];

  return docs.slice(0, MAX_RESULTS).map((doc: any) => ({
    resource: String(doc.resource?.[0] || doc.uri || doc.resource || ''),
    label: String(doc.label?.[0] || doc.label || ''),
    description: String(doc.comment?.[0] || doc.description || doc.comment || ''),
    type: Array.isArray(doc.type) ? doc.type.map(String).slice(0, 20) : [],
    redirects: Array.isArray(doc.redirects) ? doc.redirects.map(String).slice(0, 5) : [],
    refCount: Number(doc.refCount?.[0] || doc.refCount || 0),
  })).filter((r: DBpediaResult) => r.resource && r.label);
}

function inferKindFromTypes(types: string[]): CanonicalEntityKind {
  for (const type of types) {
    const lower = type.toLowerCase();
    if (lower.includes('person')) return 'person';
    if (lower.includes('organisation') || lower.includes('organization') || lower.includes('company')) return 'organization';
    if (lower.includes('place') || lower.includes('city') || lower.includes('country')) return 'place';
    if (lower.includes('event')) return 'event';
    if (lower.includes('work') || lower.includes('film') || lower.includes('book') || lower.includes('album')) return 'work';
    if (lower.includes('band') || lower.includes('musicalartist')) return 'music-artist';
    if (lower.includes('sportsteam')) return 'sports-team';
    if (lower.includes('software') || lower.includes('product')) return 'product';
  }
  return 'other';
}

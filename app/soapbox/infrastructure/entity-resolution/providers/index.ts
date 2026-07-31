/**
 * Phase 8B-4 — Provider module.
 */

// Shared infrastructure
export {
  CircuitBreaker,
  ProviderCache,
  RequestCoalescer,
  ConcurrencyLimiter,
  computeBackoffDelay,
  assessProviderHealth,
} from './provider-client';
export type { CircuitState, CircuitBreakerConfig, BackoffConfig, CacheEntry, ProviderHealth } from './provider-client';

// Wikidata
export {
  lookupEntity as wikidataLookup,
  searchEntities as wikidataSearch,
  toEntityCandidate as wikidataToCandidate,
  buildResolverResult as wikidataBuildResult,
  getHealth as wikidataHealth,
  resetProvider as wikidataReset,
  getDiagnostics as wikidataDiagnostics,
} from './wikidata-provider';

// DBpedia
export {
  searchEntities as dbpediaSearch,
  toEntityCandidates as dbpediaToCandidates,
  buildResolverResult as dbpediaBuildResult,
  getHealth as dbpediaHealth,
  resetProvider as dbpediaReset,
  getDiagnostics as dbpediaDiagnostics,
} from './dbpedia-provider';
export type { DBpediaResult } from './dbpedia-provider';

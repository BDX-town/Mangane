/**
 * Phase 8B — Entity resolution module.
 *
 * Public API for the canonical entity-resolution subsystem.
 */

export {
  createEntity,
  getEntity,
  findEntitiesByLabel,
  findEntityByProvider,
  addProviderReference,
  addAlias,
  tombstoneEntity,
  mergeEntities,
  storeResolution,
  getResolution,
  storeHashtagBinding,
  getHashtagBinding,
  storeCreatorAttribution,
  getCreatorAttribution,
  getAttributionsForResource,
  storeEvidence,
  getEvidence,
  purgeAccountData,
  resetAllStores,
  getDiagnostics,
} from './entity-repository';

// 8B-2: Native creator attribution
export { processCardAttribution } from './creator-attribution';
export type { CardAuthor, PreviewCardInput } from './creator-attribution';

// 8B-3: Structured metadata extraction
export { extractAuthors, processExtractedAuthors } from './metadata-extractor';
export type { PageMetadata, SchemaOrgPerson, ExtractedAuthor } from './metadata-extractor';

// 8B-4: Wikidata and DBpedia providers
export {
  wikidataLookup,
  wikidataSearch,
  wikidataToCandidate,
  wikidataBuildResult,
  wikidataHealth,
  wikidataReset,
  dbpediaSearch,
  dbpediaToCandidates,
  dbpediaBuildResult,
  dbpediaHealth,
  dbpediaReset,
  CircuitBreaker,
  ProviderCache,
  RequestCoalescer,
  ConcurrencyLimiter,
} from './providers';
export type { ProviderHealth, CircuitState, DBpediaResult } from './providers';

// 8B-5: Semantic hashtags
export {
  resolveHashtag,
  resolveHashtags,
  bindHashtagToEntity,
  rejectHashtagBinding,
  hasEntityBinding,
  getHashtagEntityId,
} from './semantic-hashtags';
export type { HashtagContext } from './semantic-hashtags';

// 8B-6: Custom Feed entity rules
export {
  setFeedRules,
  getFeedRules,
  removeFeedRules,
  evaluateStatus,
  hasFeedRules,
  resetAllRules,
} from './entity-feed-rules';
export type { FeedRuleDecision, MatchedRule, FeedRuleEvaluation } from './entity-feed-rules';

// 8B-7: Consumer integration (Search, Explore, Gist, Composer)
export {
  prepareSearchContext,
  buildExploreContext,
  wouldExceedDiversityCap,
  buildGistContext,
  analyzeComposerContent,
  isEntityFeatureEnabled,
  setEntityFeatureFlag,
  getEntityFeatureFlags,
} from './entity-consumers';
export type {
  SearchEntityContext,
  ResolvedQueryEntity,
  ExploreEntityContext,
  GistEntityContext,
  GistEntityInfo,
  ComposerEntityContext,
} from './entity-consumers';

// 8B-8: Trusted resolver contract and attribution domain validation
export {
  isUrlSafeForResolution,
  normalizeAttributionDomain,
  validateAttributionDomains,
} from './trusted-resolver-contract';
export type {
  TrustedMetadataResolver,
  MetadataResolveRequest,
  MetadataResolveResponse,
  ResolverHealthStatus,
  UrlSafetyResult,
} from './trusted-resolver-contract';

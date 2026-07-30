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

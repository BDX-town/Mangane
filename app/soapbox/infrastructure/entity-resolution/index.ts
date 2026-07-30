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

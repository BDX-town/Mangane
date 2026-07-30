/**
 * Phase 8B-1 — Canonical entity repository.
 *
 * In-memory entity store with future IndexedDB persistence.
 * This is the single local authority for entity records.
 *
 * Design:
 * - Entities are stored by their canonical ID
 * - Aliases are indexed for fast lookup
 * - Provider references allow cross-referencing
 * - Account-scoped resolutions are isolated
 * - Tombstones prevent resurrection after deletion
 *
 * Security:
 * - Entity IDs validated on all operations
 * - No cross-account resolution access (IDOR prevention)
 * - Labels bounded to prevent storage abuse
 * - Provider references validated for structure
 */

import {
  generateEntityId,
  isValidEntityId,
} from 'soapbox/domain/entity-resolution';

import type {
  CanonicalEntity,
  CanonicalEntityId,
  CanonicalEntityKind,
  EntityAlias,
  EntityEvidence,
  EntityProvider,
  EntityProviderReference,
  EntityRelationship,
  EntityResolution,
  EntityState,
  HashtagEntityBinding,
  LinkCreatorAttribution,
} from 'soapbox/domain/entity-resolution';

// ─── Validation constants ────────────────────────────────────────────────────

const MAX_LABEL_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_ALIASES_PER_ENTITY = 100;
const MAX_PROVIDER_REFERENCES = 50;

// ─── In-memory stores ────────────────────────────────────────────────────────

const entities = new Map<CanonicalEntityId, CanonicalEntity>();
const aliasIndex = new Map<string, Set<CanonicalEntityId>>();
const providerIndex = new Map<string, CanonicalEntityId>(); // "provider:providerId" → entityId
const relationships = new Map<string, EntityRelationship>();
const evidence = new Map<string, EntityEvidence>();
const resolutions = new Map<string, EntityResolution>(); // "accountScope:mentionKey" → resolution
const hashtagBindings = new Map<string, HashtagEntityBinding>();
const creatorAttributions = new Map<string, LinkCreatorAttribution>();

// ─── Entity CRUD ─────────────────────────────────────────────────────────────

/**
 * Create a new canonical entity.
 * Returns the generated entity ID.
 */
export function createEntity(params: {
  kind: CanonicalEntityKind;
  preferredLabel: string;
  description?: string;
  language?: string;
  imageUrl?: string;
  homepageUrl?: string;
}): CanonicalEntityId {
  const entityId = generateEntityId();
  const now = new Date().toISOString();

  // Validate and bound inputs
  const label = boundString(params.preferredLabel, MAX_LABEL_LENGTH);
  if (!label) {
    throw new Error('Entity requires a non-empty preferredLabel.');
  }

  const entity: CanonicalEntity = {
    schemaVersion: 1,
    entityId,
    kind: params.kind,
    preferredLabel: label,
    normalizedLabels: [normalizeLabel(label)],
    description: params.description ? boundString(params.description, MAX_DESCRIPTION_LENGTH) : undefined,
    language: params.language,
    imageUrl: params.imageUrl ? validateUrl(params.imageUrl) : undefined,
    homepageUrl: params.homepageUrl ? validateUrl(params.homepageUrl) : undefined,
    providerReferences: [],
    aliases: [],
    state: 'active',
    createdAt: now,
    updatedAt: now,
    sourceRevision: '1',
  };

  entities.set(entityId, entity);
  indexEntity(entity);

  return entityId;
}

/**
 * Get an entity by ID. Returns undefined if not found or tombstoned.
 */
export function getEntity(entityId: CanonicalEntityId): CanonicalEntity | undefined {
  if (!isValidEntityId(entityId)) return undefined;
  const entity = entities.get(entityId);
  if (!entity) return undefined;

  // Follow merge chain (max 5 hops to prevent infinite loops)
  if (entity.state === 'merged' && entity.mergedIntoEntityId) {
    return resolveEntityChain(entity.mergedIntoEntityId, 5);
  }

  if (entity.state === 'tombstoned') return undefined;
  return entity;
}

/**
 * Find entities by normalized label.
 */
export function findEntitiesByLabel(label: string): ReadonlyArray<CanonicalEntity> {
  const normalized = normalizeLabel(label);
  if (!normalized) return [];

  const ids = aliasIndex.get(normalized);
  if (!ids || ids.size === 0) return [];

  const results: CanonicalEntity[] = [];
  const seenIds = new Set<CanonicalEntityId>();
  for (const id of ids) {
    const entity = getEntity(id);
    if (entity && entity.state === 'active' && !seenIds.has(entity.entityId)) {
      seenIds.add(entity.entityId);
      results.push(entity);
    }
  }
  return results;
}

/**
 * Find entity by provider reference.
 */
export function findEntityByProvider(provider: EntityProvider, providerId: string): CanonicalEntity | undefined {
  const key = `${provider}:${providerId}`;
  const entityId = providerIndex.get(key);
  if (!entityId) return undefined;
  return getEntity(entityId);
}

/**
 * Add a provider reference to an existing entity.
 */
export function addProviderReference(
  entityId: CanonicalEntityId,
  reference: EntityProviderReference,
): boolean {
  const entity = entities.get(entityId);
  if (!entity || entity.state !== 'active') return false;
  if (entity.providerReferences.length >= MAX_PROVIDER_REFERENCES) return false;

  const updated: CanonicalEntity = {
    ...entity,
    providerReferences: [...entity.providerReferences, reference],
    updatedAt: new Date().toISOString(),
    sourceRevision: String(Number(entity.sourceRevision) + 1),
  };

  entities.set(entityId, updated);
  providerIndex.set(`${reference.provider}:${reference.providerId}`, entityId);
  return true;
}

/**
 * Add an alias to an entity.
 */
export function addAlias(entityId: CanonicalEntityId, alias: EntityAlias): boolean {
  const entity = entities.get(entityId);
  if (!entity || entity.state !== 'active') return false;
  if (entity.aliases.length >= MAX_ALIASES_PER_ENTITY) return false;

  const normalized = normalizeLabel(alias.alias);
  if (!normalized) return false;

  const updated: CanonicalEntity = {
    ...entity,
    aliases: [...entity.aliases, alias],
    normalizedLabels: [...new Set([...entity.normalizedLabels, normalized])],
    updatedAt: new Date().toISOString(),
    sourceRevision: String(Number(entity.sourceRevision) + 1),
  };

  entities.set(entityId, updated);
  indexAlias(normalized, entityId);
  return true;
}

/**
 * Tombstone an entity (soft delete, prevents resurrection).
 */
export function tombstoneEntity(entityId: CanonicalEntityId): boolean {
  const entity = entities.get(entityId);
  if (!entity) return false;

  const updated: CanonicalEntity = {
    ...entity,
    state: 'tombstoned' as EntityState,
    updatedAt: new Date().toISOString(),
  };
  entities.set(entityId, updated);
  return true;
}

/**
 * Merge one entity into another.
 * The source entity's aliases and references are moved to the target.
 */
export function mergeEntities(sourceId: CanonicalEntityId, targetId: CanonicalEntityId): boolean {
  if (sourceId === targetId) return false;
  const source = entities.get(sourceId);
  const target = entities.get(targetId);
  if (!source || !target) return false;
  if (source.state !== 'active' || target.state !== 'active') return false;

  // Move aliases
  for (const alias of source.aliases) {
    addAlias(targetId, alias);
  }

  // Move provider references
  for (const ref of source.providerReferences) {
    addProviderReference(targetId, ref);
  }

  // Mark source as merged
  const updatedSource: CanonicalEntity = {
    ...source,
    state: 'merged',
    mergedIntoEntityId: targetId,
    updatedAt: new Date().toISOString(),
  };
  entities.set(sourceId, updatedSource);

  return true;
}

// ─── Resolution store ────────────────────────────────────────────────────────

/**
 * Store a resolution result (account-scoped).
 */
export function storeResolution(resolution: EntityResolution): void {
  const key = `${resolution.accountScope}:${resolution.mentionKey}`;
  resolutions.set(key, resolution);
}

/**
 * Get a resolution by account scope and mention key.
 */
export function getResolution(accountScope: string, mentionKey: string): EntityResolution | undefined {
  return resolutions.get(`${accountScope}:${mentionKey}`);
}

// ─── Hashtag bindings ────────────────────────────────────────────────────────

export function storeHashtagBinding(binding: HashtagEntityBinding): void {
  hashtagBindings.set(binding.bindingKey, binding);
}

export function getHashtagBinding(normalizedHashtag: string): HashtagEntityBinding | undefined {
  return hashtagBindings.get(normalizedHashtag);
}

// ─── Creator attributions ────────────────────────────────────────────────────

export function storeCreatorAttribution(attribution: LinkCreatorAttribution): void {
  creatorAttributions.set(attribution.attributionKey, attribution);
}

export function getCreatorAttribution(attributionKey: string): LinkCreatorAttribution | undefined {
  return creatorAttributions.get(attributionKey);
}

export function getAttributionsForResource(
  accountScope: string,
  canonicalResourceUrl: string,
): ReadonlyArray<LinkCreatorAttribution> {
  const results: LinkCreatorAttribution[] = [];
  for (const attr of creatorAttributions.values()) {
    if (attr.accountScope === accountScope && attr.canonicalResourceUrl === canonicalResourceUrl) {
      results.push(attr);
    }
  }
  return results.sort((a, b) => a.ordinal - b.ordinal);
}

// ─── Evidence store ──────────────────────────────────────────────────────────

export function storeEvidence(ev: EntityEvidence): void {
  evidence.set(ev.evidenceId, ev);
}

export function getEvidence(evidenceId: string): EntityEvidence | undefined {
  return evidence.get(evidenceId);
}

// ─── Purge (account removal / test cleanup) ──────────────────────────────────

/**
 * Purge all account-scoped data for a given account.
 * Shared public entities are NOT purged (they may be used by other accounts).
 */
export function purgeAccountData(accountScope: string): number {
  let count = 0;

  // Purge resolutions
  for (const [key, res] of resolutions) {
    if (res.accountScope === accountScope) {
      resolutions.delete(key);
      count++;
    }
  }

  // Purge creator attributions
  for (const [key, attr] of creatorAttributions) {
    if (attr.accountScope === accountScope) {
      creatorAttributions.delete(key);
      count++;
    }
  }

  return count;
}

/**
 * Reset all stores (for testing only).
 */
export function resetAllStores(): void {
  entities.clear();
  aliasIndex.clear();
  providerIndex.clear();
  relationships.clear();
  evidence.clear();
  resolutions.clear();
  hashtagBindings.clear();
  creatorAttributions.clear();
}

// ─── Diagnostics ─────────────────────────────────────────────────────────────

export function getDiagnostics(): {
  entityCount: number;
  aliasCount: number;
  resolutionCount: number;
  attributionCount: number;
  } {
  return {
    entityCount: entities.size,
    aliasCount: aliasIndex.size,
    resolutionCount: resolutions.size,
    attributionCount: creatorAttributions.size,
  };
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function normalizeLabel(label: string): string {
  return label.toLowerCase().trim().replace(/\s+/g, ' ');
}

function boundString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function validateUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return undefined;
    if (parsed.username || parsed.password) return undefined;
    return parsed.href;
  } catch {
    return undefined;
  }
}

function indexEntity(entity: CanonicalEntity): void {
  for (const label of entity.normalizedLabels) {
    indexAlias(label, entity.entityId);
  }
  for (const ref of entity.providerReferences) {
    providerIndex.set(`${ref.provider}:${ref.providerId}`, entity.entityId);
  }
}

function indexAlias(normalized: string, entityId: CanonicalEntityId): void {
  let ids = aliasIndex.get(normalized);
  if (!ids) {
    ids = new Set();
    aliasIndex.set(normalized, ids);
  }
  ids.add(entityId);
}

function resolveEntityChain(entityId: CanonicalEntityId, maxHops: number): CanonicalEntity | undefined {
  if (maxHops <= 0) return undefined;
  const entity = entities.get(entityId);
  if (!entity) return undefined;
  if (entity.state === 'merged' && entity.mergedIntoEntityId) {
    return resolveEntityChain(entity.mergedIntoEntityId, maxHops - 1);
  }
  if (entity.state === 'tombstoned') return undefined;
  return entity;
}

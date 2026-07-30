/**
 * Phase 8B — Canonical entity resolution domain types.
 *
 * Defines the type system for a reusable, local-first entity-resolution
 * subsystem. These types are the single canonical authority for entity
 * identity across the application — used by creator attribution, hashtags,
 * Custom Feeds, Search, Explore, recommendations, and more.
 *
 * Design principles:
 * - Pure types with no runtime dependencies
 * - Provider-neutral (Wikidata, DBpedia are references, not authorities)
 * - Evidence-based (every resolution carries provenance)
 * - Local-first (offline-available, server is optional enrichment)
 * - Account-scoped where required (resolutions, feed rules, affinities)
 * - Fail-closed (ambiguous → unresolved, not silently bound)
 */

// ─── Entity kinds ────────────────────────────────────────────────────────────

export type CanonicalEntityKind =
  | 'person'
  | 'organization'
  | 'publication'
  | 'place'
  | 'event'
  | 'work'
  | 'product'
  | 'brand'
  | 'topic'
  | 'community'
  | 'sports-team'
  | 'music-artist'
  | 'protocol-account'
  | 'collection'
  | 'other';

// ─── Provider types ──────────────────────────────────────────────────────────

export type EntityProvider =
  | 'local'
  | 'wikidata'
  | 'dbpedia'
  | 'activitypub'
  | 'webfinger'
  | 'schema-org'
  | 'fediverse-creator'
  | 'open-graph'
  | 'oembed'
  | 'microformats'
  | 'dublin-core'
  | 'rel-author'
  | 'rel-me'
  | 'visible-byline'
  | 'future-provider';

// ─── Core entity record ──────────────────────────────────────────────────────

/** Branded entity ID type for type safety. */
export type CanonicalEntityId = string & { readonly __canonicalEntityId: unique symbol };

/** State of an entity in the local store. */
export type EntityState = 'active' | 'merged' | 'split-required' | 'unavailable' | 'tombstoned';

export interface CanonicalEntity {
  readonly schemaVersion: 1;
  readonly entityId: CanonicalEntityId;
  readonly kind: CanonicalEntityKind;
  readonly preferredLabel: string;
  readonly normalizedLabels: ReadonlyArray<string>;
  readonly description?: string;
  readonly language?: string;
  readonly imageUrl?: string;
  readonly homepageUrl?: string;
  readonly providerReferences: ReadonlyArray<EntityProviderReference>;
  readonly aliases: ReadonlyArray<EntityAlias>;
  readonly state: EntityState;
  readonly mergedIntoEntityId?: CanonicalEntityId;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly sourceRevision: string;
}

// ─── Provider references ─────────────────────────────────────────────────────

export interface EntityProviderReference {
  readonly provider: EntityProvider;
  readonly providerId: string;
  readonly canonicalUri?: string;
  readonly observedAt: string;
  readonly verifiedAt?: string;
  readonly expiresAt?: string;
  readonly evidenceIds: ReadonlyArray<string>;
}

// ─── Aliases ─────────────────────────────────────────────────────────────────

export interface EntityAlias {
  readonly alias: string;
  readonly language?: string;
  readonly provider: EntityProvider;
  readonly addedAt: string;
}

// ─── Relationships ───────────────────────────────────────────────────────────

export type EntityRelationshipPredicate =
  | 'created-by'
  | 'published-by'
  | 'same-as'
  | 'member-of'
  | 'part-of'
  | 'located-in'
  | 'about'
  | 'related-to'
  | 'instance-of'
  | 'subclass-of'
  | 'official-account'
  | 'hashtag-refers-to';

export interface EntityRelationship {
  readonly schemaVersion: 1;
  readonly relationshipId: string;
  readonly subjectEntityId: CanonicalEntityId;
  readonly predicate: EntityRelationshipPredicate;
  readonly objectEntityId: CanonicalEntityId;
  readonly confidence: number;
  readonly evidenceIds: ReadonlyArray<string>;
  readonly validFrom?: string;
  readonly validUntil?: string;
}

// ─── Evidence ────────────────────────────────────────────────────────────────

export type EvidenceKind =
  | 'exact-identifier'
  | 'provider-lookup'
  | 'label-match'
  | 'alias-match'
  | 'url-match'
  | 'domain-match'
  | 'contextual-inference'
  | 'user-explicit'
  | 'negative';

export interface EntityEvidence {
  readonly evidenceId: string;
  readonly kind: EvidenceKind;
  readonly provider: EntityProvider;
  readonly description: string;
  readonly observedAt: string;
  readonly weight: number; // 0.0 to 1.0
}

// ─── Resolution ──────────────────────────────────────────────────────────────

export type ResolutionState = 'resolved' | 'ambiguous' | 'unresolved' | 'rejected' | 'stale';

export interface EntityResolution {
  readonly schemaVersion: 1;
  readonly resolutionKey: string;
  readonly accountScope: string;
  readonly mentionKey: string;
  readonly selectedEntityId?: CanonicalEntityId;
  readonly candidateEntityIds: ReadonlyArray<CanonicalEntityId>;
  readonly confidence: number;
  readonly margin: number;
  readonly state: ResolutionState;
  readonly policyVersion: string;
  readonly evidenceIds: ReadonlyArray<string>;
  readonly observedAt: string;
  readonly expiresAt: string;
}

// ─── Candidates ──────────────────────────────────────────────────────────────

export interface EntityCandidate {
  readonly candidateKey: string;
  readonly kind: CanonicalEntityKind;
  readonly label: string;
  readonly canonicalUri?: string;
  readonly providerReferences: ReadonlyArray<EntityProviderReference>;
  readonly evidenceIds: ReadonlyArray<string>;
  readonly features: Readonly<Record<string, number | string | boolean>>;
}

// ─── Resolution input/output ─────────────────────────────────────────────────

export interface EntityResolutionInput {
  readonly mentionKey: string;
  readonly text: string;
  readonly kind?: CanonicalEntityKind;
  readonly language?: string;
  readonly contextEntityIds?: ReadonlyArray<CanonicalEntityId>;
  readonly accountScope: string;
}

export interface EntityResolutionContext {
  readonly existingEntities: ReadonlyArray<CanonicalEntity>;
  readonly existingAliases: ReadonlyArray<EntityAlias>;
  readonly followedHashtags: ReadonlyArray<string>;
}

export interface EntityResolverResult {
  readonly candidates: ReadonlyArray<EntityCandidate>;
  readonly evidence: ReadonlyArray<EntityEvidence>;
  readonly providerHealth: 'healthy' | 'degraded' | 'unavailable';
}

// ─── Resolver contract ───────────────────────────────────────────────────────

export interface EntityResolver {
  readonly id: string;
  readonly version: string;
  supports(input: EntityResolutionInput): boolean;
  resolve(
    input: EntityResolutionInput,
    context: EntityResolutionContext,
    signal: AbortSignal,
  ): Promise<EntityResolverResult>;
}

// ─── Creator attribution ─────────────────────────────────────────────────────

export type CreatorAttributionProof =
  | 'native-server-verified'
  | 'domain-account-verified'
  | 'structured-author-with-social-profile'
  | 'structured-author'
  | 'metadata-author'
  | 'visible-byline'
  | 'unverified-social-claim';

export type CreatorRole =
  | 'author'
  | 'creator'
  | 'editor'
  | 'photographer'
  | 'publisher'
  | 'other';

export interface LinkCreatorAttribution {
  readonly schemaVersion: 2;
  readonly attributionKey: string;
  readonly accountScope: string;
  readonly canonicalResourceUrl: string;
  readonly creatorEntityId: CanonicalEntityId;
  readonly creatorRole: CreatorRole;
  readonly ordinal: number;
  readonly proof: CreatorAttributionProof;
  readonly canonicalAccountUri?: string;
  readonly localAccountId?: string;
  readonly publicationEntityId?: CanonicalEntityId;
  readonly publicationDomain?: string;
  readonly authorizedDomain?: string;
  readonly evidenceIds: ReadonlyArray<string>;
  readonly observedAt: string;
  readonly verifiedAt?: string;
  readonly expiresAt: string;
}

// ─── Hashtag entity binding ──────────────────────────────────────────────────

export type HashtagBindingState = 'resolved' | 'ambiguous' | 'literal-only' | 'rejected';

export interface HashtagEntityBinding {
  readonly schemaVersion: 1;
  readonly bindingKey: string;
  readonly normalizedHashtag: string;
  readonly language?: string;
  readonly entityId?: CanonicalEntityId;
  readonly state: HashtagBindingState;
  readonly confidence: number;
  readonly contextPolicyVersion: string;
  readonly evidenceIds: ReadonlyArray<string>;
  readonly observedAt: string;
  readonly expiresAt: string;
}

// ─── Entity feed rules ───────────────────────────────────────────────────────

export type EntityFeedRuleMode = 'include' | 'exclude' | 'boost' | 'require';

export interface EntityFeedRule {
  readonly schemaVersion: 1;
  readonly ruleId: string;
  readonly feedRevisionId: string;
  readonly entityId: CanonicalEntityId;
  readonly mode: EntityFeedRuleMode;
  readonly relationDepth: 0 | 1;
  readonly allowedRelationshipPredicates: ReadonlyArray<string>;
  readonly minimumResolutionConfidence: number;
}

// ─── ID generation ───────────────────────────────────────────────────────────

/**
 * Generate a canonical entity ID.
 * Uses a prefixed UUID to distinguish from other ID types.
 */
export function generateEntityId(): CanonicalEntityId {
  const uuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  return `entity:${uuid}` as CanonicalEntityId;
}

/**
 * Validate a string as a CanonicalEntityId.
 * Must start with 'entity:' followed by a UUID-like structure.
 */
export function isValidEntityId(value: unknown): value is CanonicalEntityId {
  if (typeof value !== 'string') return false;
  if (!value.startsWith('entity:')) return false;
  if (value.length < 10 || value.length > 100) return false;
  // No control characters
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(value)) return false;
  return true;
}

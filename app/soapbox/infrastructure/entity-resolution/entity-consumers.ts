/**
 * Phase 8B-7 — Entity consumer integration.
 *
 * Provides typed interfaces for consumers of the entity resolution system:
 * Search, Explore, Gist/AI grounding, recommendations, and composer context.
 *
 * Each consumer gets a structured input contract that the entity planner
 * fills based on the canonical entity store. Consumers never call providers
 * directly — they receive pre-resolved entity context.
 *
 * Design:
 * - Consumer interfaces are pure types (no side effects)
 * - Personal affinity is separate from canonical confidence
 * - No hidden engagement maximization
 * - Private drafts stay local
 * - Explanations are machine-readable (not opaque scores)
 */

import { getEntity, findEntitiesByLabel } from './entity-repository';
import { resolveHashtag } from './semantic-hashtags';

import type {
  CanonicalEntityId,
  CanonicalEntityKind,
} from 'soapbox/domain/entity-resolution';

// ─── Search integration ──────────────────────────────────────────────────────

/**
 * Input for entity-aware search expansion.
 * The search system receives this alongside the raw query.
 */
export interface SearchEntityContext {
  /** Entities resolved from the query text. */
  readonly resolvedEntities: ReadonlyArray<ResolvedQueryEntity>;
  /** Hashtags in the query with their entity bindings. */
  readonly hashtagBindings: ReadonlyArray<{
    readonly hashtag: string;
    readonly entityId: CanonicalEntityId | null;
    readonly isResolved: boolean;
  }>;
  /** Literal terms that should be preserved as-is (handles, URLs). */
  readonly literalTerms: ReadonlyArray<string>;
  /** Expanded aliases for resolved entities. */
  readonly aliases: ReadonlyArray<string>;
}

/**
 * Prepare entity context for a search query.
 * Resolves entities and hashtags, expands aliases, identifies literals.
 */
export function prepareSearchContext(
  query: string,
  accountScope: string,
): SearchEntityContext {
  const resolvedEntities: ResolvedQueryEntity[] = [];
  const hashtagBindings: { hashtag: string; entityId: CanonicalEntityId | null; isResolved: boolean }[] = [];
  const literalTerms: string[] = [];
  const aliases: string[] = [];

  // Extract hashtags
  const hashtagMatches = query.match(/#[\w]+/g) || [];
  for (const tag of hashtagMatches.slice(0, 10)) {
    const binding = resolveHashtag(tag);
    hashtagBindings.push({
      hashtag: tag,
      entityId: binding.entityId || null,
      isResolved: binding.state === 'resolved',
    });

    if (binding.entityId) {
      const entity = getEntity(binding.entityId);
      if (entity) {
        aliases.push(...entity.normalizedLabels.slice(0, 5));
      }
    }
  }

  // Extract @handles and URLs as literal terms (never entity-resolved)
  const handleMatches = query.match(/@[\w@.]+/g) || [];
  literalTerms.push(...handleMatches);
  const urlMatches = query.match(/https?:\/\/\S+/g) || [];
  literalTerms.push(...urlMatches);

  // Try to resolve remaining non-literal text as entities
  const cleanQuery = query
    .replace(/#[\w]+/g, '')
    .replace(/@[\w@.]+/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (cleanQuery.length >= 2 && cleanQuery.length <= 100) {
    const entityMatches = findEntitiesByLabel(cleanQuery);
    for (const entity of entityMatches.slice(0, 3)) {
      resolvedEntities.push({
        entityId: entity.entityId,
        label: entity.preferredLabel,
        kind: entity.kind,
        confidence: 0.6, // Label match only
      });
      aliases.push(...entity.normalizedLabels.slice(0, 5));
      for (const alias of entity.aliases.slice(0, 5)) {
        aliases.push(alias.alias.toLowerCase());
      }
    }
  }

  return {
    resolvedEntities,
    hashtagBindings,
    literalTerms,
    aliases: [...new Set(aliases)], // Deduplicate
  };
}

export interface ResolvedQueryEntity {
  readonly entityId: CanonicalEntityId;
  readonly label: string;
  readonly kind: CanonicalEntityKind;
  readonly confidence: number;
}

// ─── Explore/Recommendations integration ─────────────────────────────────────

/**
 * Input for entity-aware content grouping in Explore.
 */
export interface ExploreEntityContext {
  /** Entity IDs detected across trending content. */
  readonly trendingEntityIds: ReadonlyArray<CanonicalEntityId>;
  /** Entity concentration (how many items reference the same entity). */
  readonly entityConcentration: ReadonlyMap<CanonicalEntityId, number>;
  /** Maximum items from a single entity to show (diversity cap). */
  readonly maxPerEntity: number;
}

/**
 * Build Explore context from a set of status entity detections.
 * Used to diversify trending content and reduce entity concentration.
 */
export function buildExploreContext(
  statusEntityPairs: ReadonlyArray<{ statusId: string; entityIds: CanonicalEntityId[] }>,
  maxPerEntity: number = 3,
): ExploreEntityContext {
  const concentration = new Map<CanonicalEntityId, number>();
  const trendingIds = new Set<CanonicalEntityId>();

  for (const pair of statusEntityPairs) {
    for (const entityId of pair.entityIds) {
      trendingIds.add(entityId);
      concentration.set(entityId, (concentration.get(entityId) || 0) + 1);
    }
  }

  return {
    trendingEntityIds: [...trendingIds],
    entityConcentration: concentration,
    maxPerEntity,
  };
}

/**
 * Check if showing another item for an entity would exceed diversity limits.
 */
export function wouldExceedDiversityCap(
  context: ExploreEntityContext,
  entityId: CanonicalEntityId,
  currentCount: number,
): boolean {
  return currentCount >= context.maxPerEntity;
}

// ─── Gist/AI grounding integration ──────────────────────────────────────────

/**
 * Entity context provided to Gist synthesis.
 * Contains structured knowledge for disambiguation, NOT proof of claims.
 */
export interface GistEntityContext {
  /** Entities mentioned in the source content. */
  readonly mentionedEntities: ReadonlyArray<GistEntityInfo>;
  /** Relationships between mentioned entities. */
  readonly entityRelationships: ReadonlyArray<{
    readonly subject: string;
    readonly predicate: string;
    readonly object: string;
  }>;
  /** Explicit disambiguation notes. */
  readonly disambiguationNotes: ReadonlyArray<string>;
}

export interface GistEntityInfo {
  readonly entityId: CanonicalEntityId;
  readonly label: string;
  readonly kind: CanonicalEntityKind;
  readonly aliases: ReadonlyArray<string>;
  /** The evidence level — NOT proof that claims about this entity are true. */
  readonly evidenceLevel: 'high' | 'medium' | 'low';
}

/**
 * Build entity context for Gist synthesis.
 * Knowledge-graph enrichment helps disambiguate but is NOT proof of truth.
 */
export function buildGistContext(
  entityIds: ReadonlyArray<CanonicalEntityId>,
): GistEntityContext {
  const mentionedEntities: GistEntityInfo[] = [];
  const disambiguationNotes: string[] = [];

  for (const entityId of entityIds.slice(0, 20)) { // Bounded
    const entity = getEntity(entityId);
    if (!entity) continue;

    let evidenceLevel: 'high' | 'medium' | 'low' = 'low';
    if (entity.providerReferences.length >= 2) {
      evidenceLevel = 'high';
    } else if (entity.providerReferences.length === 1) {
      evidenceLevel = 'medium';
    }

    mentionedEntities.push({
      entityId,
      label: entity.preferredLabel,
      kind: entity.kind,
      aliases: entity.normalizedLabels.slice(0, 5),
      evidenceLevel,
    });

    if (entity.state === 'split-required') {
      disambiguationNotes.push(`Entity "${entity.preferredLabel}" may refer to multiple distinct things.`);
    }
  }

  return {
    mentionedEntities,
    entityRelationships: [], // Populated when relationship store is wired
    disambiguationNotes,
  };
}

// ─── Composer context integration ────────────────────────────────────────────

/**
 * Warnings and suggestions for the compose form.
 * Advisory only — never blocks posting.
 */
export interface ComposerEntityContext {
  /** Hashtags that are ambiguous (multiple possible entities). */
  readonly ambiguousHashtags: ReadonlyArray<{
    readonly hashtag: string;
    readonly possibleMeanings: ReadonlyArray<string>;
  }>;
  /** Potential duplicate discussions detected. */
  readonly possibleDuplicates: ReadonlyArray<string>;
  /** Suggested context additions. */
  readonly suggestions: ReadonlyArray<string>;
}

/**
 * Analyze composer content for entity-related warnings.
 * This is advisory — private drafts stay local.
 */
export function analyzeComposerContent(
  content: string,
): ComposerEntityContext {
  const ambiguousHashtags: { hashtag: string; possibleMeanings: string[] }[] = [];
  const suggestions: string[] = [];

  // Extract and check hashtags for ambiguity
  const hashtags = content.match(/#[\w]+/g) || [];
  for (const tag of hashtags.slice(0, 10)) {
    const binding = resolveHashtag(tag);
    if (binding.state === 'ambiguous') {
      // Find the possible entity labels
      const normalized = tag.replace(/^#+/, '').toLowerCase();
      const entities = findEntitiesByLabel(normalized);
      const meanings = entities.slice(0, 3).map(e => `${e.preferredLabel} (${e.kind})`);
      if (meanings.length > 1) {
        ambiguousHashtags.push({ hashtag: tag, possibleMeanings: meanings });
      }
    }
  }

  if (ambiguousHashtags.length > 0) {
    suggestions.push('Some hashtags may have multiple meanings. Consider adding context.');
  }

  return {
    ambiguousHashtags,
    possibleDuplicates: [], // Populated when duplicate detection is wired
    suggestions,
  };
}

// ─── Feature flags ───────────────────────────────────────────────────────────

const featureFlags: Record<string, boolean> = {
  entityResolutionCore: true,
  wikidataResolver: true,
  dbpediaResolver: true,
  semanticHashtagResolution: true,
  entityAwareCustomFeeds: true,
  creatorAttributionNative: true,
  creatorMetadataExtraction: true,
  creatorAccountVerification: false, // Requires trusted resolver
  trustedMetadataResolver: false, // Requires ADR
  attributionDomainSettings: false, // Capability-gated
};

/**
 * Check if a feature flag is enabled.
 * Allows independent rollback of providers and consumers.
 */
export function isEntityFeatureEnabled(flag: string): boolean {
  return featureFlags[flag] === true;
}

/**
 * Set a feature flag (for testing or runtime disable).
 */
export function setEntityFeatureFlag(flag: string, enabled: boolean): void {
  if (flag in featureFlags) {
    featureFlags[flag] = enabled;
  }
}

/**
 * Get all feature flag states.
 */
export function getEntityFeatureFlags(): Readonly<Record<string, boolean>> {
  return { ...featureFlags };
}

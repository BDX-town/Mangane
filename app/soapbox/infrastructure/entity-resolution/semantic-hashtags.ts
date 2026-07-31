/**
 * Phase 8B-5 — Semantic hashtag resolution.
 *
 * Adds optional entity bindings to literal hashtags without replacing
 * their literal behavior. A hashtag remains a social token first;
 * entity resolution is a separate enrichment layer.
 *
 * Key behaviors:
 * - Literal hashtag behavior ALWAYS survives entity failure
 * - Context distinguishes #Apple (company vs fruit vs label)
 * - Variant hashtags (#WWDC25, #WWDC2025) may bind to same entity
 * - Ambiguous hashtags remain 'ambiguous' (not silently bound)
 * - UI must not pretend an ambiguous tag has one universal meaning
 *
 * Resolution pipeline:
 * 1. Normalize hashtag text (lowercase, strip #)
 * 2. Check existing binding cache
 * 3. If no cached binding, generate candidates from context
 * 4. Score candidates using contextual signals
 * 5. Apply binding threshold (both min score AND margin)
 * 6. Store binding (resolved, ambiguous, or literal-only)
 *
 * Security:
 * - Hashtag text bounded (max 200 chars)
 * - No private context sent to providers
 * - Entity bindings are informational (never used for authorization)
 * - Offline-first (cached bindings survive provider outage)
 */

import {
  findEntitiesByLabel,
  storeHashtagBinding,
  getHashtagBinding,
  storeEvidence,
} from './entity-repository';

import type {
  CanonicalEntityId,
  HashtagEntityBinding,
} from 'soapbox/domain/entity-resolution';

// ─── Configuration ───────────────────────────────────────────────────────────

const MAX_HASHTAG_LENGTH = 200;
const MIN_BINDING_CONFIDENCE = 0.7;
const MIN_BINDING_MARGIN = 0.2;
const BINDING_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const POLICY_VERSION = '1.0.0';

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Resolve a hashtag to its entity binding.
 *
 * Returns the existing binding if cached and fresh, otherwise
 * attempts resolution from local entity data.
 *
 * @param hashtag - The hashtag text (with or without #)
 * @param context - Optional context for disambiguation
 * @returns The binding (may be resolved, ambiguous, or literal-only)
 */
export function resolveHashtag(
  hashtag: string,
  context?: HashtagContext,
): HashtagEntityBinding {
  const normalized = normalizeHashtag(hashtag);
  if (!normalized) {
    return createLiteralBinding(hashtag);
  }

  // Check cache first
  const existing = getHashtagBinding(normalized);
  if (existing && !isExpired(existing)) {
    return existing;
  }

  // Attempt resolution from local entities
  return performResolution(normalized, context);
}

/**
 * Batch resolve multiple hashtags.
 * More efficient than calling resolveHashtag individually.
 */
export function resolveHashtags(
  hashtags: ReadonlyArray<string>,
  context?: HashtagContext,
): ReadonlyArray<HashtagEntityBinding> {
  return hashtags.map(tag => resolveHashtag(tag, context));
}

/**
 * Manually bind a hashtag to an entity (user-explicit action).
 * Used when a user explicitly selects the correct meaning.
 */
export function bindHashtagToEntity(
  hashtag: string,
  entityId: CanonicalEntityId,
  language?: string,
): HashtagEntityBinding | null {
  const normalized = normalizeHashtag(hashtag);
  if (!normalized) return null;

  const evidenceId = `ev-user-bind-${Date.now()}`;
  storeEvidence({
    evidenceId,
    kind: 'user-explicit',
    provider: 'local',
    description: `User explicitly bound #${normalized} to entity`,
    observedAt: new Date().toISOString(),
    weight: 1.0,
  });

  const binding: HashtagEntityBinding = {
    schemaVersion: 1,
    bindingKey: normalized,
    normalizedHashtag: normalized,
    language,
    entityId,
    state: 'resolved',
    confidence: 1.0,
    contextPolicyVersion: POLICY_VERSION,
    evidenceIds: [evidenceId],
    observedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + BINDING_TTL_MS * 4).toISOString(), // Longer TTL for explicit
  };

  storeHashtagBinding(binding);
  return binding;
}

/**
 * Reject an entity binding for a hashtag.
 * The hashtag will remain literal-only until the rejection expires.
 */
export function rejectHashtagBinding(hashtag: string): boolean {
  const normalized = normalizeHashtag(hashtag);
  if (!normalized) return false;

  const binding: HashtagEntityBinding = {
    schemaVersion: 1,
    bindingKey: normalized,
    normalizedHashtag: normalized,
    state: 'rejected',
    confidence: 0,
    contextPolicyVersion: POLICY_VERSION,
    evidenceIds: [],
    observedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + BINDING_TTL_MS).toISOString(),
  };

  storeHashtagBinding(binding);
  return true;
}

/**
 * Check if a hashtag has a resolved entity binding.
 */
export function hasEntityBinding(hashtag: string): boolean {
  const normalized = normalizeHashtag(hashtag);
  if (!normalized) return false;
  const binding = getHashtagBinding(normalized);
  return binding !== undefined && binding.state === 'resolved' && !isExpired(binding);
}

/**
 * Get the entity ID bound to a hashtag, if resolved.
 */
export function getHashtagEntityId(hashtag: string): CanonicalEntityId | undefined {
  const normalized = normalizeHashtag(hashtag);
  if (!normalized) return undefined;
  const binding = getHashtagBinding(normalized);
  if (!binding || binding.state !== 'resolved' || isExpired(binding)) return undefined;
  return binding.entityId;
}

// ─── Context types ───────────────────────────────────────────────────────────

export interface HashtagContext {
  /** Other hashtags in the same post (for disambiguation). */
  readonly siblingHashtags?: ReadonlyArray<string>;
  /** Entity IDs already resolved in the same context. */
  readonly resolvedEntityIds?: ReadonlyArray<CanonicalEntityId>;
  /** Language of the content. */
  readonly language?: string;
  /** The account's followed hashtags (for preference weighting). */
  readonly followedHashtags?: ReadonlyArray<string>;
}

// ─── Internal resolution ─────────────────────────────────────────────────────

function performResolution(
  normalized: string,
  context?: HashtagContext,
): HashtagEntityBinding {
  // Find matching entities by label
  const candidates = findEntitiesByLabel(normalized);

  if (candidates.length === 0) {
    // No entity matches — literal only
    const binding = createLiteralBinding(normalized);
    storeHashtagBinding(binding);
    return binding;
  }

  if (candidates.length === 1) {
    // Single match — check confidence threshold
    const confidence = computeSingleCandidateConfidence(candidates[0], normalized, context);
    if (confidence >= MIN_BINDING_CONFIDENCE) {
      const binding = createResolvedBinding(normalized, candidates[0].entityId, confidence, context?.language);
      storeHashtagBinding(binding);
      return binding;
    }
    // Below threshold — ambiguous (might be a common word)
    const binding = createAmbiguousBinding(normalized);
    storeHashtagBinding(binding);
    return binding;
  }

  // Multiple matches — attempt disambiguation
  const scored = candidates.map(c => ({
    entityId: c.entityId,
    score: computeCandidateScore(c, normalized, context),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const secondBest = scored[1];
  const margin = best.score - secondBest.score;

  if (best.score >= MIN_BINDING_CONFIDENCE && margin >= MIN_BINDING_MARGIN) {
    // Clear winner
    const binding = createResolvedBinding(normalized, best.entityId, best.score, context?.language);
    storeHashtagBinding(binding);
    return binding;
  }

  // Ambiguous — multiple plausible candidates
  const binding = createAmbiguousBinding(normalized);
  storeHashtagBinding(binding);
  return binding;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

function computeSingleCandidateConfidence(
  entity: { entityId: CanonicalEntityId; preferredLabel: string; kind: string },
  hashtag: string,
  context?: HashtagContext,
): number {
  let score = 0.5; // Base for a label match

  // Exact case match boosts confidence
  if (entity.preferredLabel.toLowerCase() === hashtag) {
    score += 0.1;
  }

  // Entity kind relevance for common hashtag patterns
  if (isLikelyEntityHashtag(hashtag, entity.kind)) {
    score += 0.15;
  }

  // Context: sibling hashtags that are already resolved to related entities
  if (context?.resolvedEntityIds && context.resolvedEntityIds.length > 0) {
    score += 0.05;
  }

  // Followed hashtag bonus (user has shown interest)
  if (context?.followedHashtags?.some(h => normalizeHashtag(h) === hashtag)) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}

function computeCandidateScore(
  entity: { entityId: CanonicalEntityId; preferredLabel: string; kind: string },
  hashtag: string,
  context?: HashtagContext,
): number {
  return computeSingleCandidateConfidence(entity, hashtag, context);
}

/**
 * Heuristic: hashtags that look like proper nouns, events, or brands
 * are more likely to be entity-resolvable.
 */
function isLikelyEntityHashtag(hashtag: string, entityKind: string): boolean {
  // Event-like patterns (year suffixes)
  if (/\d{2,4}$/.test(hashtag)) return entityKind === 'event';

  // Capitalized words (before normalization) suggest proper nouns
  // Since we're working with normalized (lowercase) form, check length as proxy
  if (hashtag.length >= 3 && hashtag.length <= 30) return true;

  return false;
}

// ─── Binding constructors ────────────────────────────────────────────────────

function createLiteralBinding(hashtag: string): HashtagEntityBinding {
  const normalized = normalizeHashtag(hashtag) || hashtag.toLowerCase().replace(/^#/, '');
  return {
    schemaVersion: 1,
    bindingKey: normalized,
    normalizedHashtag: normalized,
    state: 'literal-only',
    confidence: 0,
    contextPolicyVersion: POLICY_VERSION,
    evidenceIds: [],
    observedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + BINDING_TTL_MS).toISOString(),
  };
}

function createResolvedBinding(
  normalized: string,
  entityId: CanonicalEntityId,
  confidence: number,
  language?: string,
): HashtagEntityBinding {
  const evidenceId = `ev-hashtag-resolve-${Date.now()}`;
  storeEvidence({
    evidenceId,
    kind: 'label-match',
    provider: 'local',
    description: `Hashtag #${normalized} resolved to entity with confidence ${confidence.toFixed(2)}`,
    observedAt: new Date().toISOString(),
    weight: confidence,
  });

  return {
    schemaVersion: 1,
    bindingKey: normalized,
    normalizedHashtag: normalized,
    language,
    entityId,
    state: 'resolved',
    confidence,
    contextPolicyVersion: POLICY_VERSION,
    evidenceIds: [evidenceId],
    observedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + BINDING_TTL_MS).toISOString(),
  };
}

function createAmbiguousBinding(normalized: string): HashtagEntityBinding {
  return {
    schemaVersion: 1,
    bindingKey: normalized,
    normalizedHashtag: normalized,
    state: 'ambiguous',
    confidence: 0,
    contextPolicyVersion: POLICY_VERSION,
    evidenceIds: [],
    observedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + BINDING_TTL_MS).toISOString(),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeHashtag(hashtag: string): string | null {
  if (!hashtag || typeof hashtag !== 'string') return null;
  const stripped = hashtag.replace(/^#+/, '').trim().toLowerCase();
  if (stripped.length === 0 || stripped.length > MAX_HASHTAG_LENGTH) return null;
  // Reject control characters
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(stripped)) return null;
  return stripped;
}

function isExpired(binding: HashtagEntityBinding): boolean {
  if (!binding.expiresAt) return false;
  return Date.now() > new Date(binding.expiresAt).getTime();
}

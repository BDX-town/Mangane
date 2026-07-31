/**
 * Phase 8B-6 — Custom Feed entity rules.
 *
 * Provides entity-aware filtering for Custom Feeds. Feed creators can
 * define rules that match canonical entities (not just literal keywords).
 *
 * Rule modes:
 * - include: status appears in feed if entity matches
 * - exclude: status excluded if entity matches
 * - boost: entity match boosts ranking score
 * - require: ALL require rules must match (AND logic)
 *
 * Graph expansion is bounded:
 * - relationDepth 0: exact entity only
 * - relationDepth 1: entity + first-degree relationships (bounded by predicates)
 * - No depth > 1 (prevents unbounded crawl)
 *
 * Security:
 * - Private feed rules never sent to external providers
 * - Entity matching uses local cache only (no real-time provider calls)
 * - Moderation/blocks/filters always override feed rules
 * - Rule evaluation is deterministic and bounded
 */

import { getEntity } from './entity-repository';
import { getHashtagEntityId } from './semantic-hashtags';

import type {
  CanonicalEntityId,
  EntityFeedRule,
  EntityFeedRuleMode,
} from 'soapbox/domain/entity-resolution';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_RULES_PER_FEED = 50;
const MAX_RELATION_FAN_OUT = 10;
const MAX_CANDIDATES_PER_EVALUATION = 20;

// ─── Rule storage (in-memory, keyed by feedRevisionId) ───────────────────────

const ruleStore = new Map<string, EntityFeedRule[]>();

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Store entity rules for a feed revision.
 * Replaces all existing rules for that revision.
 */
export function setFeedRules(feedRevisionId: string, rules: EntityFeedRule[]): boolean {
  if (!feedRevisionId || typeof feedRevisionId !== 'string') return false;
  if (rules.length > MAX_RULES_PER_FEED) return false;

  // Validate each rule
  for (const rule of rules) {
    if (!validateRule(rule)) return false;
  }

  ruleStore.set(feedRevisionId, [...rules]);
  return true;
}

/**
 * Get entity rules for a feed revision.
 */
export function getFeedRules(feedRevisionId: string): ReadonlyArray<EntityFeedRule> {
  return ruleStore.get(feedRevisionId) || [];
}

/**
 * Remove all rules for a feed revision (unpin/unsubscribe/delete).
 */
export function removeFeedRules(feedRevisionId: string): void {
  ruleStore.delete(feedRevisionId);
}

/**
 * Evaluate whether a status matches the entity rules for a feed.
 *
 * @param feedRevisionId - The feed revision to evaluate against
 * @param statusEntities - Entity IDs detected in the status
 * @param statusHashtags - Hashtags in the status
 * @returns Evaluation result
 */
export function evaluateStatus(
  feedRevisionId: string,
  statusEntities: ReadonlyArray<CanonicalEntityId>,
  statusHashtags: ReadonlyArray<string>,
): FeedRuleEvaluation {
  const rules = ruleStore.get(feedRevisionId);
  if (!rules || rules.length === 0) {
    return { decision: 'no-rules', matchedRules: [], boostScore: 0 };
  }

  // Resolve hashtags to entity IDs
  const hashtagEntityIds: CanonicalEntityId[] = [];
  for (const tag of statusHashtags.slice(0, MAX_CANDIDATES_PER_EVALUATION)) {
    const entityId = getHashtagEntityId(tag);
    if (entityId) hashtagEntityIds.push(entityId);
  }

  // Combined entity set for matching
  const allEntityIds = new Set([...statusEntities, ...hashtagEntityIds]);

  const matchedRules: MatchedRule[] = [];
  let hasInclude = false;
  let hasExclude = false;
  let requiresMet = true;
  let boostScore = 0;
  let hasRequireRules = false;

  for (const rule of rules) {
    const matches = doesRuleMatch(rule, allEntityIds);

    if (matches) {
      matchedRules.push({ ruleId: rule.ruleId, mode: rule.mode, entityId: rule.entityId });

      switch (rule.mode) {
        case 'include':
          hasInclude = true;
          break;
        case 'exclude':
          hasExclude = true;
          break;
        case 'boost':
          boostScore += 1.0;
          break;
        case 'require':
          // require is checked below
          break;
      }
    } else if (rule.mode === 'require') {
      hasRequireRules = true;
      requiresMet = false;
    }

    if (rule.mode === 'require' && matches) {
      hasRequireRules = true;
    }
  }

  // Decision logic:
  // - exclude always wins
  // - require rules must ALL match (if any exist)
  // - include rules make status eligible
  // - no rules matched → excluded by default (feed is entity-filtered)
  if (hasExclude) {
    return { decision: 'excluded', matchedRules, boostScore: 0 };
  }
  if (hasRequireRules && !requiresMet) {
    return { decision: 'excluded', matchedRules, boostScore: 0 };
  }
  if (hasInclude || (hasRequireRules && requiresMet)) {
    return { decision: 'included', matchedRules, boostScore };
  }

  // Only boost rules matched — status is eligible with boost
  if (boostScore > 0) {
    return { decision: 'included', matchedRules, boostScore };
  }

  // No include/require/boost matched
  return { decision: 'excluded', matchedRules: [], boostScore: 0 };
}

/**
 * Check if a feed has any entity rules defined.
 */
export function hasFeedRules(feedRevisionId: string): boolean {
  const rules = ruleStore.get(feedRevisionId);
  return rules !== undefined && rules.length > 0;
}

/**
 * Reset all rules (for testing).
 */
export function resetAllRules(): void {
  ruleStore.clear();
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type FeedRuleDecision = 'included' | 'excluded' | 'no-rules';

export interface MatchedRule {
  readonly ruleId: string;
  readonly mode: EntityFeedRuleMode;
  readonly entityId: CanonicalEntityId;
}

export interface FeedRuleEvaluation {
  readonly decision: FeedRuleDecision;
  readonly matchedRules: ReadonlyArray<MatchedRule>;
  readonly boostScore: number;
}

// ─── Internal ────────────────────────────────────────────────────────────────

function doesRuleMatch(
  rule: EntityFeedRule,
  statusEntityIds: Set<CanonicalEntityId>,
): boolean {
  // Direct match (depth 0)
  if (statusEntityIds.has(rule.entityId)) {
    return true;
  }

  // Related entity match (depth 1) — bounded expansion
  if (rule.relationDepth === 1) {
    return checkRelatedEntities(rule, statusEntityIds);
  }

  return false;
}

/**
 * Check if any status entity is related to the rule entity
 * through an allowed predicate. Bounded by MAX_RELATION_FAN_OUT.
 *
 * NOTE: This currently uses label-based lookup as a proxy for
 * relationship traversal. Full relationship graph traversal
 * will be implemented when the relationship store is populated.
 */
function checkRelatedEntities(
  rule: EntityFeedRule,
  statusEntityIds: Set<CanonicalEntityId>,
): boolean {
  const ruleEntity = getEntity(rule.entityId);
  if (!ruleEntity) return false;

  // For now, check if any status entity shares an alias with the rule entity
  // This is a bounded approximation until full relationship traversal exists
  let checked = 0;
  for (const entityId of statusEntityIds) {
    if (checked >= MAX_RELATION_FAN_OUT) break;
    checked++;

    const entity = getEntity(entityId);
    if (!entity) continue;

    // Check label overlap (weak signal, bounded)
    for (const label of entity.normalizedLabels) {
      if (ruleEntity.normalizedLabels.includes(label)) {
        return true;
      }
    }
  }

  return false;
}

function validateRule(rule: EntityFeedRule): boolean {
  if (!rule.ruleId || typeof rule.ruleId !== 'string') return false;
  if (!rule.feedRevisionId || typeof rule.feedRevisionId !== 'string') return false;
  if (!rule.entityId || typeof rule.entityId !== 'string') return false;
  if (!['include', 'exclude', 'boost', 'require'].includes(rule.mode)) return false;
  if (rule.relationDepth !== 0 && rule.relationDepth !== 1) return false;
  if (rule.minimumResolutionConfidence < 0 || rule.minimumResolutionConfidence > 1) return false;
  if (!Array.isArray(rule.allowedRelationshipPredicates)) return false;
  return true;
}

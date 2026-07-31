/**
 * Phase 8B-6 — Custom Feed entity rules tests.
 */

import {
  evaluateStatus,
  getFeedRules,
  hasFeedRules,
  removeFeedRules,
  resetAllRules,
  setFeedRules,
} from '../entity-feed-rules';
import { createEntity, resetAllStores } from '../entity-repository';

import type { CanonicalEntityId, EntityFeedRule } from 'soapbox/domain/entity-resolution';

const feedRevision = 'feed-rev-1';

function makeRule(overrides: Partial<EntityFeedRule> = {}): EntityFeedRule {
  return {
    schemaVersion: 1,
    ruleId: `rule-${Math.random().toString(36).slice(2)}`,
    feedRevisionId: feedRevision,
    entityId: 'entity:test-id' as CanonicalEntityId,
    mode: 'include',
    relationDepth: 0,
    allowedRelationshipPredicates: [],
    minimumResolutionConfidence: 0.6,
    ...overrides,
  };
}

beforeEach(() => {
  resetAllStores();
  resetAllRules();
});

describe('setFeedRules / getFeedRules', () => {
  it('stores and retrieves rules', () => {
    const rules = [makeRule()];
    expect(setFeedRules(feedRevision, rules)).toBe(true);
    expect(getFeedRules(feedRevision).length).toBe(1);
  });

  it('rejects more than MAX_RULES_PER_FEED (50)', () => {
    const rules = Array.from({ length: 51 }, () => makeRule());
    expect(setFeedRules(feedRevision, rules)).toBe(false);
  });

  it('rejects invalid rules', () => {
    const badRule = { ...makeRule(), mode: 'invalid' as any };
    expect(setFeedRules(feedRevision, [badRule])).toBe(false);
  });

  it('rejects rules with invalid relationDepth', () => {
    const badRule = { ...makeRule(), relationDepth: 2 as any };
    expect(setFeedRules(feedRevision, [badRule])).toBe(false);
  });
});

describe('evaluateStatus', () => {
  it('returns no-rules when feed has no rules', () => {
    const result = evaluateStatus('nonexistent-feed', [], []);
    expect(result.decision).toBe('no-rules');
  });

  it('includes status when include rule matches', () => {
    const entityId = createEntity({ kind: 'organization', preferredLabel: 'TestOrg' });
    setFeedRules(feedRevision, [makeRule({ entityId, mode: 'include' })]);

    const result = evaluateStatus(feedRevision, [entityId], []);
    expect(result.decision).toBe('included');
    expect(result.matchedRules.length).toBe(1);
  });

  it('excludes status when exclude rule matches', () => {
    const entityId = createEntity({ kind: 'person', preferredLabel: 'Blocked' });
    setFeedRules(feedRevision, [
      makeRule({ entityId, mode: 'exclude' }),
      makeRule({ entityId, mode: 'include' }), // Include should be overridden
    ]);

    const result = evaluateStatus(feedRevision, [entityId], []);
    expect(result.decision).toBe('excluded');
  });

  it('excludes when require rule does not match', () => {
    const required = createEntity({ kind: 'topic', preferredLabel: 'Required' });
    const other = createEntity({ kind: 'topic', preferredLabel: 'Other' });
    setFeedRules(feedRevision, [makeRule({ entityId: required, mode: 'require' })]);

    const result = evaluateStatus(feedRevision, [other], []);
    expect(result.decision).toBe('excluded');
  });

  it('includes when require rule matches', () => {
    const required = createEntity({ kind: 'topic', preferredLabel: 'Must' });
    setFeedRules(feedRevision, [makeRule({ entityId: required, mode: 'require' })]);

    const result = evaluateStatus(feedRevision, [required], []);
    expect(result.decision).toBe('included');
  });

  it('applies boost score for boost rules', () => {
    const entityId = createEntity({ kind: 'event', preferredLabel: 'Conference' });
    setFeedRules(feedRevision, [
      makeRule({ entityId, mode: 'include' }),
      makeRule({ entityId, mode: 'boost' }),
    ]);

    const result = evaluateStatus(feedRevision, [entityId], []);
    expect(result.decision).toBe('included');
    expect(result.boostScore).toBeGreaterThan(0);
  });

  it('excludes when no include/require rules match', () => {
    const entityA = createEntity({ kind: 'person', preferredLabel: 'A' });
    const entityB = createEntity({ kind: 'person', preferredLabel: 'B' });
    setFeedRules(feedRevision, [makeRule({ entityId: entityA, mode: 'include' })]);

    const result = evaluateStatus(feedRevision, [entityB], []);
    expect(result.decision).toBe('excluded');
  });
});

describe('hasFeedRules / removeFeedRules', () => {
  it('reports whether rules exist', () => {
    expect(hasFeedRules(feedRevision)).toBe(false);
    setFeedRules(feedRevision, [makeRule()]);
    expect(hasFeedRules(feedRevision)).toBe(true);
  });

  it('removes rules', () => {
    setFeedRules(feedRevision, [makeRule()]);
    removeFeedRules(feedRevision);
    expect(hasFeedRules(feedRevision)).toBe(false);
  });
});

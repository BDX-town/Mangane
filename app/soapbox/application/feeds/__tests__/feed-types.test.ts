/**
 * Phase 8A — Feed type and assignment tests.
 *
 * Tests the core feed routing logic: relationship classification,
 * feed assignment, source provenance, deduplication, and transition
 * reconciliation.
 */

import {
  assignToFeed,
  classifyRelationship,
  computeFeedTransition,
  deduplicationKey,
  determineSourceKinds,
} from '../feed-types';

describe('classifyRelationship', () => {
  it('returns mutual when following and followed_by', () => {
    expect(classifyRelationship({ following: true, followed_by: true })).toBe('mutual');
  });

  it('returns outbound-only when following but not followed_by', () => {
    expect(classifyRelationship({ following: true, followed_by: false })).toBe('outbound-only');
  });

  it('returns inbound-only when not following but followed_by', () => {
    expect(classifyRelationship({ following: false, followed_by: true })).toBe('inbound-only');
  });

  it('returns none when neither following nor followed_by', () => {
    expect(classifyRelationship({ following: false, followed_by: false })).toBe('none');
  });

  it('returns blocked when blocking', () => {
    expect(classifyRelationship({ following: true, followed_by: true, blocking: true })).toBe('blocked');
  });

  it('returns muted when muting', () => {
    expect(classifyRelationship({ following: true, followed_by: true, muting: true })).toBe('muted');
  });

  it('returns none for null/undefined input', () => {
    expect(classifyRelationship(null)).toBe('none');
    expect(classifyRelationship(undefined)).toBe('none');
  });

  it('blocking takes precedence over muting', () => {
    expect(classifyRelationship({ blocking: true, muting: true })).toBe('blocked');
  });
});

describe('assignToFeed', () => {
  it('mutual → home', () => {
    expect(assignToFeed('mutual', false)).toBe('home');
  });

  it('mutual with hashtag → home (mutual takes precedence)', () => {
    expect(assignToFeed('mutual', true)).toBe('home');
  });

  it('outbound-only → for-you', () => {
    expect(assignToFeed('outbound-only', false)).toBe('for-you');
  });

  it('outbound-only with hashtag → for-you', () => {
    expect(assignToFeed('outbound-only', true)).toBe('for-you');
  });

  it('no relationship with hashtag → for-you', () => {
    expect(assignToFeed('none', true)).toBe('for-you');
  });

  it('no relationship without hashtag → null (excluded)', () => {
    expect(assignToFeed('none', false)).toBeNull();
  });

  it('inbound-only with hashtag → for-you', () => {
    expect(assignToFeed('inbound-only', true)).toBe('for-you');
  });

  it('inbound-only without hashtag → null', () => {
    expect(assignToFeed('inbound-only', false)).toBeNull();
  });

  it('blocked → null (never shown)', () => {
    expect(assignToFeed('blocked', false)).toBeNull();
    expect(assignToFeed('blocked', true)).toBeNull();
  });

  it('muted → null (never shown)', () => {
    expect(assignToFeed('muted', false)).toBeNull();
    expect(assignToFeed('muted', true)).toBeNull();
  });
});

describe('determineSourceKinds', () => {
  it('mutual non-boost → mutual-relationship', () => {
    const kinds = determineSourceKinds('mutual', false, false);
    expect(kinds).toEqual(['mutual-relationship']);
  });

  it('outbound-only non-boost → outbound-only-relationship', () => {
    const kinds = determineSourceKinds('outbound-only', false, false);
    expect(kinds).toEqual(['outbound-only-relationship']);
  });

  it('outbound-only with hashtag → both sources', () => {
    const kinds = determineSourceKinds('outbound-only', true, false);
    expect(kinds).toContain('outbound-only-relationship');
    expect(kinds).toContain('followed-hashtag');
  });

  it('mutual boost → boost-by-mutual', () => {
    const kinds = determineSourceKinds('mutual', false, true);
    expect(kinds).toEqual(['boost-by-mutual']);
  });

  it('outbound-only boost → boost-by-outbound', () => {
    const kinds = determineSourceKinds('outbound-only', false, true);
    expect(kinds).toEqual(['boost-by-outbound']);
  });

  it('hashtag only → followed-hashtag', () => {
    const kinds = determineSourceKinds('none', true, false);
    expect(kinds).toEqual(['followed-hashtag']);
  });
});

describe('deduplicationKey', () => {
  it('uses canonical URI when available', () => {
    const key = deduplicationKey('https://example.com/status/123', 'scope', 'id');
    expect(key).toBe('uri:https://example.com/status/123');
  });

  it('falls back to scoped ID when no URI', () => {
    const key = deduplicationKey(null, 'scope-1', 'status-1');
    expect(key).toBe('scoped:scope-1:status-1');
  });

  it('falls back for empty URI', () => {
    const key = deduplicationKey('', 'scope-1', 'status-1');
    expect(key).toBe('scoped:scope-1:status-1');
  });
});

describe('computeFeedTransition', () => {
  it('mutual → outbound-only moves from home to for-you', () => {
    const result = computeFeedTransition('mutual', 'outbound-only');
    expect(result).toEqual({ from: 'home', to: 'for-you' });
  });

  it('outbound-only → mutual moves from for-you to home', () => {
    const result = computeFeedTransition('outbound-only', 'mutual');
    expect(result).toEqual({ from: 'for-you', to: 'home' });
  });

  it('same classification returns null', () => {
    expect(computeFeedTransition('mutual', 'mutual')).toBeNull();
    expect(computeFeedTransition('outbound-only', 'outbound-only')).toBeNull();
  });

  it('to/from blocked returns null (no feed involved)', () => {
    expect(computeFeedTransition('mutual', 'blocked')).toBeNull();
    expect(computeFeedTransition('blocked', 'mutual')).toBeNull();
  });

  it('outbound-only to none returns null (exits both feeds)', () => {
    expect(computeFeedTransition('outbound-only', 'none')).toBeNull();
  });
});

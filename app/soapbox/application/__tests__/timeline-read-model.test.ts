/**
 * Phase 7 — Timeline read model tests.
 *
 * Verifies the type contracts and utility functions of the read model.
 */

import { EMPTY_TIMELINE, toReduxTimelineKey } from '../timeline-read-model';

import type { CanonicalTimelineId } from '../timeline-read-model';

describe('EMPTY_TIMELINE', () => {
  it('has correct default values', () => {
    expect(EMPTY_TIMELINE.items).toEqual([]);
    expect(EMPTY_TIMELINE.hasMore).toBe(true);
    expect(EMPTY_TIMELINE.isLoading).toBe(false);
    expect(EMPTY_TIMELINE.isOnline).toBe(false);
    expect(EMPTY_TIMELINE.queuedCount).toBe(0);
    expect(EMPTY_TIMELINE.hasFailed).toBe(false);
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(EMPTY_TIMELINE)).toBe(true);
    expect(Object.isFrozen(EMPTY_TIMELINE.items)).toBe(true);
  });
});

describe('toReduxTimelineKey', () => {
  it('maps home correctly', () => {
    expect(toReduxTimelineKey('home')).toBe('home');
  });

  it('maps public correctly', () => {
    expect(toReduxTimelineKey('public')).toBe('public');
  });

  it('maps public:local correctly', () => {
    expect(toReduxTimelineKey('public:local')).toBe('public:local');
  });

  it('maps list IDs correctly', () => {
    expect(toReduxTimelineKey('list:12345' as CanonicalTimelineId)).toBe('list:12345');
  });

  it('maps hashtag IDs correctly', () => {
    expect(toReduxTimelineKey('hashtag:fediverse' as CanonicalTimelineId)).toBe('hashtag:fediverse');
  });

  it('maps account IDs correctly', () => {
    expect(toReduxTimelineKey('account:789' as CanonicalTimelineId)).toBe('account:789');
  });
});

/**
 * Phase 8C-5 — Resurfacing policy tests.
 */

import { evaluateResurfacing } from '../resurfacing-policy';


import type { SharedPresentationRecord } from '../shared-activity-types';

function makePresentation(overrides: Partial<SharedPresentationRecord> = {}): SharedPresentationRecord {
  return {
    accountScope: 'https://instance.example/users/alice',
    feedId: 'home',
    contentKey: 'content-1',
    generation: 1,
    firstPresentedAt: Date.now() - 60000,
    lastPresentedAt: Date.now() - 60000,
    lastMeaningfulActivityAt: Date.now() - 60000,
    impressionState: 'presented',
    expanded: false,
    dismissed: false,
    latestKnownShareCount: 3,
    policyRevision: '1.0',
    ...overrides,
  };
}

describe('evaluateResurfacing', () => {
  const now = Date.now();

  it('always resurfaces when never presented', () => {
    expect(evaluateResurfacing(null, 5, false, false, now)).toBe('resurface');
  });

  it('suppresses within hard no-resurface interval', () => {
    const recent = makePresentation({ lastPresentedAt: now - 5 * 60 * 1000 }); // 5 min ago
    expect(evaluateResurfacing(recent, 10, false, false, now)).toBe('suppress');
  });

  it('allows update-in-place for material edit during hard interval', () => {
    const recent = makePresentation({ lastPresentedAt: now - 5 * 60 * 1000 });
    expect(evaluateResurfacing(recent, 3, true, false, now)).toBe('update-in-place');
  });

  it('suppresses dismissed items', () => {
    const dismissed = makePresentation({
      lastPresentedAt: now - 2 * 60 * 60 * 1000, // 2 hours ago
      dismissed: true,
    });
    expect(evaluateResurfacing(dismissed, 10, false, false, now)).toBe('suppress');
  });

  it('resurfaces dismissed items on material edit', () => {
    const dismissed = makePresentation({
      lastPresentedAt: now - 2 * 60 * 60 * 1000,
      dismissed: true,
    });
    expect(evaluateResurfacing(dismissed, 3, true, false, now)).toBe('resurface');
  });

  it('updates in place during strong grouping window', () => {
    const grouped = makePresentation({
      lastPresentedAt: now - 30 * 60 * 1000, // 30 min ago (within 6h window)
    });
    expect(evaluateResurfacing(grouped, 5, false, false, now)).toBe('update-in-place');
  });

  it('resurfaces for prioritized sharer after conditional window', () => {
    const old = makePresentation({
      lastPresentedAt: now - 8 * 60 * 60 * 1000, // 8 hours ago
    });
    expect(evaluateResurfacing(old, 4, false, true, now)).toBe('resurface');
  });

  it('resurfaces for significant share growth (3+)', () => {
    const old = makePresentation({
      lastPresentedAt: now - 8 * 60 * 60 * 1000,
      latestKnownShareCount: 3,
    });
    expect(evaluateResurfacing(old, 6, false, false, now)).toBe('resurface');
  });

  it('resurfaces after normal eligibility with new activity', () => {
    const veryOld = makePresentation({
      lastPresentedAt: now - 25 * 60 * 60 * 1000, // 25 hours ago
      latestKnownShareCount: 5,
    });
    expect(evaluateResurfacing(veryOld, 8, false, false, now)).toBe('resurface');
  });

  it('suppresses after normal eligibility with no new activity', () => {
    const veryOld = makePresentation({
      lastPresentedAt: now - 25 * 60 * 60 * 1000,
      latestKnownShareCount: 5,
    });
    expect(evaluateResurfacing(veryOld, 5, false, false, now)).toBe('suppress');
  });
});

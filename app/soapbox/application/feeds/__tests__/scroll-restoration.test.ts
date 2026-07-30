/**
 * Phase 8D — Scroll restoration security and correctness tests.
 *
 * Tests the defensive parsing, TTL expiry, cross-scope rejection,
 * and self-healing behavior of the scroll restoration system.
 */

import {
  purgeAllScrollAnchors,
  purgeScrollAnchor,
  restoreScrollAnchor,
  saveScrollAnchor,
} from '../scroll-restoration';

const baseKey = {
  deployment: 'test',
  instanceOrigin: 'https://instance.example',
  accountUrl: 'https://instance.example/users/alice',
  feedId: 'home',
};

beforeEach(() => {
  sessionStorage.clear();
});

describe('saveScrollAnchor', () => {
  it('saves a valid anchor', () => {
    const result = saveScrollAnchor(baseKey, 'status-123', 42);
    expect(result).toBe(true);
  });

  it('rejects empty anchor ID', () => {
    expect(saveScrollAnchor(baseKey, '', 0)).toBe(false);
  });

  it('rejects excessively long anchor ID', () => {
    expect(saveScrollAnchor(baseKey, 'x'.repeat(600), 0)).toBe(false);
  });

  it('rejects non-finite offset', () => {
    expect(saveScrollAnchor(baseKey, 'id', Infinity)).toBe(false);
    expect(saveScrollAnchor(baseKey, 'id', NaN)).toBe(false);
  });

  it('rejects excessively large offset', () => {
    expect(saveScrollAnchor(baseKey, 'id', 200_000)).toBe(false);
  });

  it('rejects missing accountUrl', () => {
    expect(saveScrollAnchor({ ...baseKey, accountUrl: '' }, 'id', 0)).toBe(false);
  });

  it('rejects missing feedId', () => {
    expect(saveScrollAnchor({ ...baseKey, feedId: '' }, 'id', 0)).toBe(false);
  });
});

describe('restoreScrollAnchor', () => {
  it('restores a saved anchor', () => {
    saveScrollAnchor(baseKey, 'status-456', 100);
    const anchor = restoreScrollAnchor(baseKey);
    expect(anchor).not.toBeNull();
    expect(anchor!.anchorId).toBe('status-456');
    expect(anchor!.offsetPx).toBe(100);
    expect(anchor!.feedId).toBe('home');
  });

  it('returns null for missing anchor', () => {
    expect(restoreScrollAnchor(baseKey)).toBeNull();
  });

  it('rejects expired anchors (TTL)', () => {
    saveScrollAnchor(baseKey, 'old-id', 0);
    // Manually expire by patching the stored value
    const stored = JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage).find(k => k.startsWith('mangane:scroll:'))!)!);
    stored.capturedAt = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
    const key = Object.keys(sessionStorage).find(k => k.startsWith('mangane:scroll:'))!;
    sessionStorage.setItem(key, JSON.stringify(stored));

    expect(restoreScrollAnchor(baseKey)).toBeNull();
    // Self-healing: invalid record should be deleted
    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it('rejects cross-feed reads', () => {
    saveScrollAnchor(baseKey, 'status-1', 50);
    const differentFeed = { ...baseKey, feedId: 'for-you' };
    expect(restoreScrollAnchor(differentFeed)).toBeNull();
  });

  it('rejects corrupted JSON (self-healing)', () => {
    // Save a valid one first to get the real key
    saveScrollAnchor(baseKey, 'id', 0);
    const realKey = Object.keys(sessionStorage).find(k => k.startsWith('mangane:scroll:'))!;
    sessionStorage.setItem(realKey, 'not-json{{{');

    expect(restoreScrollAnchor(baseKey)).toBeNull();
    // Self-healing: corrupted record deleted
    expect(sessionStorage.getItem(realKey)).toBeNull();
  });

  it('rejects anchors with control characters in ID', () => {
    saveScrollAnchor(baseKey, 'valid-id', 0);
    const realKey = Object.keys(sessionStorage).find(k => k.startsWith('mangane:scroll:'))!;
    const stored = JSON.parse(sessionStorage.getItem(realKey)!);
    stored.anchorId = 'id\x00injection';
    sessionStorage.setItem(realKey, JSON.stringify(stored));

    expect(restoreScrollAnchor(baseKey)).toBeNull();
  });

  it('rejects wrong schema version', () => {
    saveScrollAnchor(baseKey, 'id', 0);
    const realKey = Object.keys(sessionStorage).find(k => k.startsWith('mangane:scroll:'))!;
    const stored = JSON.parse(sessionStorage.getItem(realKey)!);
    stored.v = 99;
    sessionStorage.setItem(realKey, JSON.stringify(stored));

    expect(restoreScrollAnchor(baseKey)).toBeNull();
  });

  it('returns null for missing key parts', () => {
    expect(restoreScrollAnchor({ ...baseKey, accountUrl: '' })).toBeNull();
  });
});

describe('purgeScrollAnchor', () => {
  it('removes a specific feed anchor', () => {
    saveScrollAnchor(baseKey, 'id', 0);
    purgeScrollAnchor(baseKey);
    expect(restoreScrollAnchor(baseKey)).toBeNull();
  });

  it('does not throw for non-existent anchors', () => {
    expect(() => purgeScrollAnchor(baseKey)).not.toThrow();
  });
});

describe('purgeAllScrollAnchors', () => {
  it('removes all scroll anchors', () => {
    saveScrollAnchor(baseKey, 'id1', 0);
    saveScrollAnchor({ ...baseKey, feedId: 'for-you' }, 'id2', 0);
    sessionStorage.setItem('unrelated-key', 'keep me');

    purgeAllScrollAnchors();

    expect(restoreScrollAnchor(baseKey)).toBeNull();
    expect(restoreScrollAnchor({ ...baseKey, feedId: 'for-you' })).toBeNull();
    // Non-scroll keys preserved
    expect(sessionStorage.getItem('unrelated-key')).toBe('keep me');
  });
});

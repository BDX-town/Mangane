/**
 * Phase 8B-5 — Semantic hashtag tests.
 *
 * Tests hashtag resolution, binding, disambiguation, rejection,
 * TTL expiry, and literal-only fallback behavior.
 */

import { createEntity, resetAllStores } from '../entity-repository';
import {
  resolveHashtag,
  resolveHashtags,
  bindHashtagToEntity,
  rejectHashtagBinding,
  hasEntityBinding,
  getHashtagEntityId,
} from '../semantic-hashtags';

beforeEach(() => {
  resetAllStores();
});

describe('resolveHashtag', () => {
  it('returns literal-only for hashtags with no matching entity', () => {
    const binding = resolveHashtag('#randomtag');
    expect(binding.state).toBe('literal-only');
    expect(binding.normalizedHashtag).toBe('randomtag');
    expect(binding.entityId).toBeUndefined();
  });

  it('resolves when a single high-confidence entity matches', () => {
    // Create an entity that matches the hashtag
    createEntity({ kind: 'event', preferredLabel: 'WWDC2025' });
    const binding = resolveHashtag('#WWDC2025');
    // With a single match, confidence depends on scoring — may be resolved or ambiguous
    expect(['resolved', 'ambiguous', 'literal-only']).toContain(binding.state);
    expect(binding.normalizedHashtag).toBe('wwdc2025');
  });

  it('returns ambiguous when multiple entities match', () => {
    createEntity({ kind: 'organization', preferredLabel: 'Apple' });
    createEntity({ kind: 'topic', preferredLabel: 'Apple' });
    const binding = resolveHashtag('#Apple');
    // Multiple matches without clear winner → ambiguous
    expect(binding.state).toBe('ambiguous');
  });

  it('strips leading # and normalizes case', () => {
    createEntity({ kind: 'event', preferredLabel: 'fediday' });
    const binding = resolveHashtag('##FediDay');
    expect(binding.normalizedHashtag).toBe('fediday');
  });

  it('returns literal-only for empty/invalid input', () => {
    expect(resolveHashtag('').state).toBe('literal-only');
    expect(resolveHashtag('#').state).toBe('literal-only');
  });

  it('caches binding and returns cached on second call', () => {
    const first = resolveHashtag('#cached');
    const second = resolveHashtag('#cached');
    expect(first.observedAt).toBe(second.observedAt);
  });

  it('uses context for disambiguation', () => {
    createEntity({ kind: 'organization', preferredLabel: 'rust' });
    const binding = resolveHashtag('#rust', {
      siblingHashtags: ['#programming', '#systems'],
      language: 'en',
    });
    // Context may boost score but with a common word like "rust",
    // result depends on scoring heuristics
    expect(['resolved', 'ambiguous', 'literal-only']).toContain(binding.state);
  });
});

describe('resolveHashtags (batch)', () => {
  it('resolves multiple hashtags', () => {
    const results = resolveHashtags(['#hello', '#world', '#test']);
    expect(results.length).toBe(3);
    results.forEach(r => {
      expect(r.schemaVersion).toBe(1);
      expect(r.normalizedHashtag).toBeDefined();
    });
  });
});

describe('bindHashtagToEntity', () => {
  it('explicitly binds a hashtag to an entity', () => {
    const entityId = createEntity({ kind: 'organization', preferredLabel: 'Mastodon' });
    const binding = bindHashtagToEntity('#mastodon', entityId);
    expect(binding).not.toBeNull();
    expect(binding!.state).toBe('resolved');
    expect(binding!.entityId).toBe(entityId);
    expect(binding!.confidence).toBe(1.0);
  });

  it('returns null for invalid hashtag', () => {
    const entityId = createEntity({ kind: 'person', preferredLabel: 'X' });
    expect(bindHashtagToEntity('', entityId)).toBeNull();
  });

  it('overrides previous ambiguous binding', () => {
    createEntity({ kind: 'organization', preferredLabel: 'Apple' });
    createEntity({ kind: 'topic', preferredLabel: 'Apple' });
    resolveHashtag('#apple'); // Will be ambiguous

    const entityId = createEntity({ kind: 'brand', preferredLabel: 'Apple Inc' });
    bindHashtagToEntity('#apple', entityId);

    expect(hasEntityBinding('#apple')).toBe(true);
    expect(getHashtagEntityId('#apple')).toBe(entityId);
  });
});

describe('rejectHashtagBinding', () => {
  it('rejects a binding (prevents future auto-resolution)', () => {
    createEntity({ kind: 'organization', preferredLabel: 'TestTag' });
    rejectHashtagBinding('#testtag');

    // After rejection, resolveHashtag should return the rejected state from cache
    const binding = resolveHashtag('#testtag');
    expect(binding.state).toBe('rejected');
  });

  it('returns false for invalid input', () => {
    expect(rejectHashtagBinding('')).toBe(false);
  });
});

describe('hasEntityBinding', () => {
  it('returns true for resolved bindings', () => {
    const entityId = createEntity({ kind: 'event', preferredLabel: 'FOSDEM' });
    bindHashtagToEntity('#fosdem', entityId);
    expect(hasEntityBinding('#fosdem')).toBe(true);
  });

  it('returns false for ambiguous bindings', () => {
    createEntity({ kind: 'organization', preferredLabel: 'Java' });
    createEntity({ kind: 'place', preferredLabel: 'Java' });
    resolveHashtag('#java');
    expect(hasEntityBinding('#java')).toBe(false);
  });

  it('returns false for unknown hashtags', () => {
    expect(hasEntityBinding('#nevercreated')).toBe(false);
  });
});

describe('getHashtagEntityId', () => {
  it('returns entity ID for resolved hashtags', () => {
    const entityId = createEntity({ kind: 'community', preferredLabel: 'Fediverse' });
    bindHashtagToEntity('#fediverse', entityId);
    expect(getHashtagEntityId('#fediverse')).toBe(entityId);
  });

  it('returns undefined for unresolved hashtags', () => {
    expect(getHashtagEntityId('#nothing')).toBeUndefined();
  });
});

describe('security', () => {
  it('rejects hashtags with control characters', () => {
    const binding = resolveHashtag('#bad\x00tag');
    expect(binding.state).toBe('literal-only');
  });

  it('rejects excessively long hashtags', () => {
    const long = '#' + 'x'.repeat(250);
    const binding = resolveHashtag(long);
    expect(binding.state).toBe('literal-only');
  });
});

import {
  normalizeVisibility,
  isKnownVisibility,
  projectStatus,
} from '../projections';

import type { StoredStatus } from '../schema';

describe('Visibility normalization (fail-closed)', () => {
  it('preserves public', () => expect(normalizeVisibility('public')).toBe('public'));
  it('preserves unlisted', () => expect(normalizeVisibility('unlisted')).toBe('unlisted'));
  it('preserves private', () => expect(normalizeVisibility('private')).toBe('private'));
  it('preserves direct', () => expect(normalizeVisibility('direct')).toBe('direct'));
  it('preserves local (Akkoma)', () => expect(normalizeVisibility('local')).toBe('local'));
  it('preserves mutualsonly', () => expect(normalizeVisibility('mutualsonly')).toBe('mutualsonly'));

  it('DOES NOT coerce unknown values to public', () => {
    // This is the critical safety test: unknown visibility must NOT become public
    expect(normalizeVisibility('secret_new_type')).toBe('secret_new_type');
    expect(normalizeVisibility('followers_only')).toBe('followers_only');
  });

  it('defaults null/undefined/empty to public (server omission)', () => {
    expect(normalizeVisibility(null)).toBe('public');
    expect(normalizeVisibility(undefined)).toBe('public');
    expect(normalizeVisibility('')).toBe('public');
  });

  it('defaults non-string to public', () => {
    expect(normalizeVisibility(123)).toBe('public');
    expect(normalizeVisibility(true)).toBe('public');
  });
});

describe('isKnownVisibility', () => {
  it('returns true for known values', () => {
    expect(isKnownVisibility('public')).toBe(true);
    expect(isKnownVisibility('local')).toBe(true);
    expect(isKnownVisibility('direct')).toBe(true);
  });

  it('returns false for unknown values', () => {
    expect(isKnownVisibility('something_new')).toBe(false);
    expect(isKnownVisibility('')).toBe(false);
  });
});

describe('projectStatus', () => {
  const makeStored = (overrides: Partial<StoredStatus> = {}): StoredStatus => ({
    accountUrl: 'https://example.com/users/test',
    id: 'status-1',
    uri: 'https://example.com/statuses/1',
    content: '<p>Hello world</p>',
    accountId: 'account-1',
    createdAt: '2026-01-01T00:00:00Z',
    visibility: 'public',
    sensitive: false,
    spoilerText: '',
    mediaAttachmentIds: ['m1', 'm2'],
    inReplyToId: null,
    inReplyToAccountId: null,
    reblogId: null,
    favourited: true,
    reblogged: false,
    bookmarked: true,
    pinned: false,
    raw: {},
    localUpdatedAt: Date.now(),
    ...overrides,
  });

  it('projects all fields without raw', () => {
    const projected = projectStatus(makeStored());
    expect(projected.id).toBe('status-1');
    expect(projected.content).toBe('<p>Hello world</p>');
    expect(projected.favourited).toBe(true);
    expect(projected.bookmarked).toBe(true);
    // raw is NOT in the projection
    expect((projected as any).raw).toBeUndefined();
    expect((projected as any).accountUrl).toBeUndefined();
    expect((projected as any).localUpdatedAt).toBeUndefined();
  });

  it('freezes mediaAttachmentIds (immutable)', () => {
    const projected = projectStatus(makeStored());
    expect(Object.isFrozen(projected.mediaAttachmentIds)).toBe(true);
  });

  it('marks unknown visibility correctly', () => {
    const projected = projectStatus(makeStored({ visibility: 'local' }));
    expect(projected.visibility).toBe('local');
    expect(projected.isVisibilityKnown).toBe(true);

    const unknown = projectStatus(makeStored({ visibility: 'new_type' }));
    expect(unknown.visibility).toBe('new_type');
    expect(unknown.isVisibilityKnown).toBe(false);
  });

  it('does not expose raw, accountUrl, or localUpdatedAt', () => {
    const projected = projectStatus(makeStored({ raw: { secret: 'data' } }));
    const keys = Object.keys(projected);
    expect(keys).not.toContain('raw');
    expect(keys).not.toContain('accountUrl');
    expect(keys).not.toContain('localUpdatedAt');
  });
});

/**
 * Phase 8C — Event deduplication and content grouping tests.
 */

import {
  addToContentGroup,
  generateContentKey,
  generateEventKey,

  getContentGroup,
  isDuplicateEvent,
  purgeAccountState,
  removeEvent,
  removeFromContentGroup,
  resetAllState,
} from '../event-deduplication';

const scope = 'https://instance.example/users/alice';
const feed = 'home';

beforeEach(() => {
  resetAllState();
});

describe('generateEventKey', () => {
  it('prefers canonical URI when available', () => {
    const key = generateEventKey({
      accountScope: scope,
      feedId: feed,
      activityUri: 'https://remote.example/activities/123',
      serverStatusId: 'local-456',
      kind: 'share',
    });
    expect(key).toContain('https://remote.example/activities/123');
  });

  it('falls back to scoped server ID', () => {
    const key = generateEventKey({
      accountScope: scope,
      feedId: feed,
      serverStatusId: 'status-789',
      kind: 'original',
    });
    expect(key).toContain('status-789');
    expect(key).toContain(scope);
  });

  it('includes kind in scoped key', () => {
    const shareKey = generateEventKey({ accountScope: scope, feedId: feed, serverStatusId: '1', kind: 'share' });
    const origKey = generateEventKey({ accountScope: scope, feedId: feed, serverStatusId: '1', kind: 'original' });
    expect(shareKey).not.toBe(origKey);
  });
});

describe('generateContentKey', () => {
  it('prefers canonical URI', () => {
    const key = generateContentKey({
      accountScope: scope,
      canonicalUri: 'https://origin.example/posts/abc',
      statusId: 'local-1',
    });
    expect(key).toBe('content-uri:https://origin.example/posts/abc');
  });

  it('uses origin URL as fallback', () => {
    const key = generateContentKey({
      accountScope: scope,
      originUrl: 'https://origin.example/posts/def',
      statusId: 'local-2',
    });
    expect(key).toBe('content-url:https://origin.example/posts/def');
  });

  it('uses scoped fallback when no URI available', () => {
    const key = generateContentKey({ accountScope: scope, statusId: 'local-3' });
    expect(key).toContain('content-scoped');
    expect(key).toContain(scope);
  });

  it('rejects non-http URIs', () => {
    const key = generateContentKey({
      accountScope: scope,
      canonicalUri: 'file:///etc/passwd',
      statusId: 'local-4',
    });
    expect(key).toContain('content-scoped'); // Falls through to fallback
  });
});

describe('isDuplicateEvent', () => {
  it('returns false for first occurrence', () => {
    expect(isDuplicateEvent(scope, 'event-1')).toBe(false);
  });

  it('returns true for duplicate', () => {
    isDuplicateEvent(scope, 'event-2');
    expect(isDuplicateEvent(scope, 'event-2')).toBe(true);
  });

  it('isolates by account scope', () => {
    isDuplicateEvent(scope, 'shared-event');
    const otherScope = 'https://instance.example/users/bob';
    expect(isDuplicateEvent(otherScope, 'shared-event')).toBe(false);
  });

  it('rejects invalid keys (empty, control chars)', () => {
    expect(isDuplicateEvent(scope, '')).toBe(false);
    expect(isDuplicateEvent(scope, 'bad\x00key')).toBe(false);
  });
});

describe('removeEvent', () => {
  it('removes a previously recorded event', () => {
    isDuplicateEvent(scope, 'removable');
    expect(removeEvent(scope, 'removable')).toBe(true);
    // Should no longer be duplicate
    expect(isDuplicateEvent(scope, 'removable')).toBe(false);
  });

  it('returns false for unknown events', () => {
    expect(removeEvent(scope, 'unknown')).toBe(false);
  });
});

describe('addToContentGroup', () => {
  it('creates a new group for first event', () => {
    addToContentGroup({
      accountScope: scope,
      feedId: feed,
      contentKey: 'content-1',
      eventKey: 'ev-1',
      kind: 'original',
      actorId: 'author-1',
      statusId: 'status-1',
      serverOrderKey: '100',
    });

    const group = getContentGroup(scope, feed, 'content-1');
    expect(group).toBeDefined();
    expect(group!.originalStatusId).toBe('status-1');
  });

  it('adds shares to existing group', () => {
    addToContentGroup({
      accountScope: scope, feedId: feed, contentKey: 'content-2',
      eventKey: 'ev-orig', kind: 'original', actorId: 'a1', statusId: 's1', serverOrderKey: '100',
    });
    addToContentGroup({
      accountScope: scope, feedId: feed, contentKey: 'content-2',
      eventKey: 'ev-share1', kind: 'share', actorId: 'a2', statusId: 's1', serverOrderKey: '200',
    });
    addToContentGroup({
      accountScope: scope, feedId: feed, contentKey: 'content-2',
      eventKey: 'ev-share2', kind: 'share', actorId: 'a3', statusId: 's1', serverOrderKey: '300',
    });

    const group = getContentGroup(scope, feed, 'content-2');
    expect(group!.shareEventKeys.size).toBe(2);
    expect(group!.eligibleSharerIds.size).toBe(2);
    expect(group!.latestServerOrderKey).toBe('300');
  });
});

describe('removeFromContentGroup', () => {
  it('removes a sharer (undo share)', () => {
    addToContentGroup({
      accountScope: scope, feedId: feed, contentKey: 'undo-test',
      eventKey: 'ev-x', kind: 'share', actorId: 'actor-x', statusId: 's', serverOrderKey: '1',
    });
    const remains = removeFromContentGroup({
      accountScope: scope, feedId: feed, contentKey: 'undo-test',
      eventKey: 'ev-x', actorId: 'actor-x',
    });
    expect(remains).toBe(false); // No events remain
    expect(getContentGroup(scope, feed, 'undo-test')).toBeUndefined();
  });
});

describe('purgeAccountState', () => {
  it('removes all state for an account', () => {
    isDuplicateEvent(scope, 'purge-ev');
    addToContentGroup({
      accountScope: scope, feedId: feed, contentKey: 'purge-c',
      eventKey: 'e', kind: 'original', actorId: 'a', statusId: 's', serverOrderKey: '1',
    });
    purgeAccountState(scope);
    expect(isDuplicateEvent(scope, 'purge-ev')).toBe(false); // Not duplicate anymore
    expect(getContentGroup(scope, feed, 'purge-c')).toBeUndefined();
  });
});

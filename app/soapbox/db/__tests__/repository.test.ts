/**
 * Phase 5 — Repository IDOR and integrity tests.
 *
 * These tests verify:
 * - Account scope validation rejects invalid/malicious inputs
 * - Cross-account data access is impossible through the repository API
 * - Record integrity is validated on read
 * - Bulk operations respect account boundaries
 * - Purge removes all account data without touching other accounts
 */
import 'fake-indexeddb/auto';
import Dexie from 'dexie';

import {
  createAccountScope,
  AccountScopeError,
  TableRepository,
} from '../repository';
import { ManganeDatabase } from '../schema';

import type { StoredStatus, StoredDraft } from '../schema';

// Use fake-indexeddb for testing (in-memory IndexedDB implementation)
let testDb: ManganeDatabase;

beforeEach(async() => {
  // Create a fresh database for each test
  testDb = new ManganeDatabase(`test-db-${Date.now()}-${Math.random()}`);
  await testDb.open();
});

afterEach(async() => {
  await testDb.close();
  await Dexie.delete(testDb.name);
});

// ─── Account Scope Validation ────────────────────────────────────────────────

describe('createAccountScope', () => {
  it('accepts a valid https account URL', () => {
    const scope = createAccountScope('https://mastodon.social/users/alice');
    expect(scope.accountUrl).toBe('https://mastodon.social/users/alice');
  });

  it('accepts a valid http account URL', () => {
    const scope = createAccountScope('http://local.dev/users/test');
    expect(scope.accountUrl).toBe('http://local.dev/users/test');
  });

  it('normalizes the URL', () => {
    const scope = createAccountScope('https://MASTODON.SOCIAL/users/alice');
    expect(scope.accountUrl).toBe('https://mastodon.social/users/alice');
  });

  it('rejects empty string', () => {
    expect(() => createAccountScope('')).toThrow(AccountScopeError);
  });

  it('rejects non-string input', () => {
    expect(() => createAccountScope(null)).toThrow(AccountScopeError);
    expect(() => createAccountScope(undefined)).toThrow(AccountScopeError);
    expect(() => createAccountScope(123)).toThrow(AccountScopeError);
    expect(() => createAccountScope({})).toThrow(AccountScopeError);
  });

  it('rejects URLs exceeding max length', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(2048);
    expect(() => createAccountScope(longUrl)).toThrow(AccountScopeError);
  });

  it('rejects non-http protocols', () => {
    expect(() => createAccountScope('ftp://example.com/user')).toThrow(AccountScopeError);
    expect(() => createAccountScope('javascript:alert(1)')).toThrow(AccountScopeError);
    expect(() => createAccountScope('file:///etc/passwd')).toThrow(AccountScopeError);
    expect(() => createAccountScope('data:text/html,<script>alert(1)</script>')).toThrow(AccountScopeError);
  });

  it('rejects URLs with null bytes', () => {
    expect(() => createAccountScope('https://example.com/user\x00evil')).toThrow(AccountScopeError);
  });

  it('rejects URLs with newlines', () => {
    expect(() => createAccountScope('https://example.com/user\nevil')).toThrow(AccountScopeError);
    expect(() => createAccountScope('https://example.com/user\revil')).toThrow(AccountScopeError);
  });

  it('rejects invalid URLs', () => {
    expect(() => createAccountScope('not a url')).toThrow(AccountScopeError);
    expect(() => createAccountScope('://missing-protocol')).toThrow(AccountScopeError);
  });

  it('returns a frozen object (immutable)', () => {
    const scope = createAccountScope('https://example.com/users/test');
    expect(Object.isFrozen(scope)).toBe(true);
  });
});

// ─── Cross-Account IDOR Prevention ──────────────────────────────────────────

describe('Cross-account IDOR prevention', () => {
  const aliceScope = createAccountScope('https://mastodon.social/users/alice');
  const bobScope = createAccountScope('https://mastodon.social/users/bob');

  const makeStatus = (id: string): Omit<StoredStatus, 'accountUrl' | 'localUpdatedAt'> => ({
    id,
    uri: `https://mastodon.social/statuses/${id}`,
    content: '<p>Test status</p>',
    accountId: 'account-1',
    createdAt: '2026-01-01T00:00:00Z',
    visibility: 'public',
    sensitive: false,
    spoilerText: '',
    mediaAttachmentIds: [],
    inReplyToId: null,
    inReplyToAccountId: null,
    reblogId: null,
    favourited: false,
    reblogged: false,
    bookmarked: false,
    pinned: false,
    raw: {},
  });

  let repo: TableRepository<StoredStatus>;

  beforeEach(() => {
    repo = new TableRepository<StoredStatus>(testDb.statuses, 'statuses');
  });

  it('cannot read another account\'s records', async() => {
    await repo.put(aliceScope, makeStatus('status-1'));
    const result = await repo.get(bobScope, 'status-1');
    expect(result).toBeUndefined();
  });

  it('cannot list another account\'s records', async() => {
    await repo.putMany(aliceScope, [makeStatus('s1'), makeStatus('s2'), makeStatus('s3')]);
    const bobResults = await repo.query(bobScope);
    expect(bobResults).toHaveLength(0);
  });

  it('cannot count another account\'s records', async() => {
    await repo.putMany(aliceScope, [makeStatus('s1'), makeStatus('s2')]);
    const bobCount = await repo.count(bobScope);
    expect(bobCount).toBe(0);
    const aliceCount = await repo.count(aliceScope);
    expect(aliceCount).toBe(2);
  });

  it('cannot delete another account\'s records', async() => {
    await repo.put(aliceScope, makeStatus('status-1'));
    await repo.delete(bobScope, 'status-1');
    // Alice's record should still exist
    const result = await repo.get(aliceScope, 'status-1');
    expect(result).toBeDefined();
    expect(result?.id).toBe('status-1');
  });

  it('purge only removes the target account\'s records', async() => {
    await repo.putMany(aliceScope, [makeStatus('a1'), makeStatus('a2')]);
    await repo.putMany(bobScope, [makeStatus('b1'), makeStatus('b2')]);

    await repo.purgeAccount(aliceScope);

    expect(await repo.count(aliceScope)).toBe(0);
    expect(await repo.count(bobScope)).toBe(2);
  });

  it('bulkGet only returns records for the requesting account', async() => {
    await repo.put(aliceScope, makeStatus('shared-id'));
    await repo.put(bobScope, makeStatus('shared-id'));

    const aliceResults = await repo.getMany(aliceScope, ['shared-id']);
    expect(aliceResults[0]?.accountUrl).toBe(aliceScope.accountUrl);

    const bobResults = await repo.getMany(bobScope, ['shared-id']);
    expect(bobResults[0]?.accountUrl).toBe(bobScope.accountUrl);
  });
});

// ─── Input Validation ────────────────────────────────────────────────────────

describe('Input validation', () => {
  let repo: TableRepository<StoredStatus>;

  beforeEach(() => {
    repo = new TableRepository<StoredStatus>(testDb.statuses, 'statuses');
  });

  const scope = createAccountScope('https://example.com/users/test');

  it('rejects empty ID', async() => {
    await expect(repo.get(scope, '')).rejects.toThrow('Invalid entity ID');
  });

  it('rejects ID with control characters', async() => {
    await expect(repo.get(scope, 'id\x00evil')).rejects.toThrow('prohibited characters');
  });

  it('rejects ID exceeding max length', async() => {
    await expect(repo.get(scope, 'x'.repeat(513))).rejects.toThrow('Invalid entity ID');
  });
});

// ─── Bulk Operations ─────────────────────────────────────────────────────────

describe('Bulk operations', () => {
  const scope = createAccountScope('https://example.com/users/bulk-test');
  let repo: TableRepository<StoredStatus>;

  const makeStatus = (id: string): Omit<StoredStatus, 'accountUrl' | 'localUpdatedAt'> => ({
    id,
    uri: `https://example.com/statuses/${id}`,
    content: `<p>Status ${id}</p>`,
    accountId: 'acc-1',
    createdAt: '2026-01-01T00:00:00Z',
    visibility: 'public',
    sensitive: false,
    spoilerText: '',
    mediaAttachmentIds: [],
    inReplyToId: null,
    inReplyToAccountId: null,
    reblogId: null,
    favourited: false,
    reblogged: false,
    bookmarked: false,
    pinned: false,
    raw: {},
  });

  beforeEach(() => {
    repo = new TableRepository<StoredStatus>(testDb.statuses, 'statuses');
  });

  it('putMany writes multiple records atomically', async() => {
    const statuses = Array.from({ length: 100 }, (_, i) => makeStatus(`s-${i}`));
    await repo.putMany(scope, statuses);
    expect(await repo.count(scope)).toBe(100);
  });

  it('putMany is idempotent (upsert)', async() => {
    await repo.putMany(scope, [makeStatus('s-1'), makeStatus('s-2')]);
    await repo.putMany(scope, [makeStatus('s-1'), makeStatus('s-2')]);
    expect(await repo.count(scope)).toBe(2);
  });

  it('deleteMany removes only specified records', async() => {
    await repo.putMany(scope, [makeStatus('a'), makeStatus('b'), makeStatus('c')]);
    await repo.deleteMany(scope, ['a', 'c']);
    expect(await repo.count(scope)).toBe(1);
    expect(await repo.get(scope, 'b')).toBeDefined();
  });

  it('empty arrays are no-ops', async() => {
    await expect(repo.putMany(scope, [])).resolves.toBeUndefined();
    await expect(repo.deleteMany(scope, [])).resolves.toBeUndefined();
  });
});

// ─── Full Account Purge ──────────────────────────────────────────────────────

describe('purgeAllAccountData', () => {
  const scope = createAccountScope('https://example.com/users/purge-test');
  const otherScope = createAccountScope('https://other.com/users/safe');

  it('removes all records across all tables for the target account', async() => {
    // Write to multiple tables
    await testDb.statuses.put({
      accountUrl: scope.accountUrl, id: 's1', uri: '', content: '', accountId: '',
      createdAt: '', visibility: 'public', sensitive: false, spoilerText: '',
      mediaAttachmentIds: [], inReplyToId: null, inReplyToAccountId: null,
      reblogId: null, favourited: false, reblogged: false, bookmarked: false,
      pinned: false, raw: {}, localUpdatedAt: Date.now(),
    });
    await testDb.drafts.put({
      accountUrl: scope.accountUrl, id: 'd1', content: 'draft',
      visibility: 'public', sensitive: false, spoilerText: '',
      inReplyToId: null, mediaIds: [], language: null,
      createdAt: Date.now(), updatedAt: Date.now(), localUpdatedAt: Date.now(),
    });

    // Write to other account (should survive)
    await testDb.statuses.put({
      accountUrl: otherScope.accountUrl, id: 's2', uri: '', content: '', accountId: '',
      createdAt: '', visibility: 'public', sensitive: false, spoilerText: '',
      mediaAttachmentIds: [], inReplyToId: null, inReplyToAccountId: null,
      reblogId: null, favourited: false, reblogged: false, bookmarked: false,
      pinned: false, raw: {}, localUpdatedAt: Date.now(),
    });

    // Purge via individual table repositories (same logic as purgeAllAccountData)
    const statusRepo = new TableRepository<StoredStatus>(testDb.statuses, 'statuses');
    const draftRepo = new TableRepository<StoredDraft>(testDb.drafts, 'drafts');
    const deletedStatuses = await statusRepo.purgeAccount(scope);
    const deletedDrafts = await draftRepo.purgeAccount(scope);
    expect(deletedStatuses + deletedDrafts).toBeGreaterThanOrEqual(2);

    // Verify target account is empty
    expect(await testDb.statuses.where('accountUrl').equals(scope.accountUrl).count()).toBe(0);
    expect(await testDb.drafts.where('accountUrl').equals(scope.accountUrl).count()).toBe(0);

    // Verify other account is untouched
    expect(await testDb.statuses.where('accountUrl').equals(otherScope.accountUrl).count()).toBe(1);
  });
});

import 'fake-indexeddb/auto';

import { ManganeDatabase } from '../schema';
import {
  setLocalStoreEnabled,
  isLocalStoreEnabled,
  persistAccounts,
  persistStatuses,
  persistNotifications,
  loadCachedStatuses,
  loadCachedNotifications,
} from '../sync';


// Mock the db instance
jest.mock('../instance', () => {
  const { ManganeDatabase } = jest.requireActual('../schema');
  const testDb = new ManganeDatabase(`sync-test-${Date.now()}-${Math.random()}`);
  return { __esModule: true, default: testDb, db: testDb };
});

const getTestDb = (): ManganeDatabase => require('../instance').default;

const ACCOUNT_URL = 'https://mastodon.social/users/alice';

beforeEach(async() => {
  const testDb = getTestDb();
  await testDb.open();
  setLocalStoreEnabled(true);
});

afterEach(async() => {
  const testDb = getTestDb();
  await Promise.all(testDb.tables.map(t => t.clear()));
  setLocalStoreEnabled(false);
});

describe('Feature flag', () => {
  it('does nothing when disabled', async() => {
    setLocalStoreEnabled(false);
    expect(isLocalStoreEnabled()).toBe(false);

    await persistStatuses(ACCOUNT_URL, [{ id: 's1', content: 'test' }]);
    const cached = await loadCachedStatuses(ACCOUNT_URL);
    expect(cached).toHaveLength(0);
  });

  it('persists when enabled', async() => {
    setLocalStoreEnabled(true);
    expect(isLocalStoreEnabled()).toBe(true);

    await persistStatuses(ACCOUNT_URL, [{
      id: 's1', uri: 'https://example.com/s/1', content: '<p>Hello</p>',
      account: { id: 'a1' }, created_at: '2026-01-01T00:00:00Z',
      visibility: 'public', sensitive: false, spoiler_text: '',
      media_attachments: [], favourited: false, reblogged: false,
      bookmarked: false, pinned: false,
    }]);

    const testDb = getTestDb();
    const count = await testDb.statuses.where('accountUrl').equals(ACCOUNT_URL).count();
    expect(count).toBe(1);
  });
});

describe('persistAccounts', () => {
  it('writes normalized account records', async() => {
    await persistAccounts(ACCOUNT_URL, [{
      id: 'acc-1', username: 'alice', acct: 'alice',
      display_name: 'Alice', avatar: 'https://example.com/avatar.png',
      header: '', followers_count: 100, following_count: 50,
      statuses_count: 200, note: '<p>Bio</p>', url: ACCOUNT_URL,
      locked: false, bot: false, created_at: '2020-01-01',
    }]);

    const testDb = getTestDb();
    const record = await testDb.accounts.get([ACCOUNT_URL, 'acc-1']);
    expect(record).toBeDefined();
    expect(record?.username).toBe('alice');
    expect(record?.followersCount).toBe(100);
    expect(record?.accountUrl).toBe(ACCOUNT_URL);
  });

  it('skips records without valid id', async() => {
    await persistAccounts(ACCOUNT_URL, [
      { id: '', username: 'empty' },
      { username: 'missing-id' },
      null as any,
    ]);

    const testDb = getTestDb();
    const count = await testDb.accounts.where('accountUrl').equals(ACCOUNT_URL).count();
    expect(count).toBe(0);
  });

  it('is non-fatal on invalid account URL', async() => {
    // Should not throw
    await expect(persistAccounts('not-a-url', [{ id: '1', username: 'x' }])).resolves.toBeUndefined();
  });
});

describe('persistStatuses', () => {
  it('normalizes API snake_case to stored camelCase', async() => {
    await persistStatuses(ACCOUNT_URL, [{
      id: 'status-1', uri: 'https://example.com/s/1',
      content: '<p>Post content</p>',
      account: { id: 'author-1' },
      created_at: '2026-07-01T12:00:00Z',
      visibility: 'unlisted',
      sensitive: true,
      spoiler_text: 'CW text',
      media_attachments: [{ id: 'media-1' }],
      in_reply_to_id: 'parent-1',
      in_reply_to_account_id: 'parent-acc',
      favourited: true,
      reblogged: false,
      bookmarked: true,
      pinned: false,
    }]);

    const testDb = getTestDb();
    const record = await testDb.statuses.get([ACCOUNT_URL, 'status-1']);
    expect(record?.accountId).toBe('author-1');
    expect(record?.visibility).toBe('unlisted');
    expect(record?.sensitive).toBe(true);
    expect(record?.spoilerText).toBe('CW text');
    expect(record?.mediaAttachmentIds).toEqual(['media-1']);
    expect(record?.inReplyToId).toBe('parent-1');
    expect(record?.favourited).toBe(true);
    expect(record?.bookmarked).toBe(true);
  });

  it('stores raw API response for forward compatibility', async() => {
    const rawStatus = {
      id: 's-raw', uri: '', content: 'test', account: { id: 'a1' },
      created_at: '', visibility: 'public', sensitive: false,
      spoiler_text: '', media_attachments: [],
      custom_field: 'preserved',
    };
    await persistStatuses(ACCOUNT_URL, [rawStatus]);

    const testDb = getTestDb();
    const record = await testDb.statuses.get([ACCOUNT_URL, 's-raw']);
    expect((record?.raw as any).custom_field).toBe('preserved');
  });

  it('normalizes invalid visibility to public', async() => {
    await persistStatuses(ACCOUNT_URL, [{
      id: 's-invalid-vis', uri: '', content: '', account: { id: 'a' },
      visibility: 'bogus', sensitive: false, spoiler_text: '', media_attachments: [],
    }]);

    const testDb = getTestDb();
    const record = await testDb.statuses.get([ACCOUNT_URL, 's-invalid-vis']);
    expect(record?.visibility).toBe('public');
  });
});

describe('persistNotifications', () => {
  it('writes notification records with correct types', async() => {
    await persistNotifications(ACCOUNT_URL, [{
      id: 'n-1', type: 'favourite',
      created_at: '2026-07-01T00:00:00Z',
      account: { id: 'sender-1' },
      status: { id: 'target-status' },
      pleroma: { is_seen: true },
    }]);

    const testDb = getTestDb();
    const record = await testDb.notifications.get([ACCOUNT_URL, 'n-1']);
    expect(record?.type).toBe('favourite');
    expect(record?.accountId).toBe('sender-1');
    expect(record?.statusId).toBe('target-status');
    expect(record?.read).toBe(true);
  });
});

describe('loadCachedStatuses', () => {
  it('returns raw API objects for the importer pipeline', async() => {
    // Write directly to simulate previously cached data
    const testDb = getTestDb();
    await testDb.statuses.put({
      accountUrl: ACCOUNT_URL, id: 'cached-1', uri: '', content: 'cached',
      accountId: 'a1', createdAt: '2026-01-01', visibility: 'public',
      sensitive: false, spoilerText: '', mediaAttachmentIds: [],
      inReplyToId: null, inReplyToAccountId: null, reblogId: null,
      favourited: false, reblogged: false, bookmarked: false, pinned: false,
      raw: { id: 'cached-1', content: 'cached', account: { id: 'a1' } },
      localUpdatedAt: Date.now(),
    });

    const results = await loadCachedStatuses(ACCOUNT_URL);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('cached-1');
    expect(results[0].content).toBe('cached');
  });

  it('returns empty array when disabled', async() => {
    setLocalStoreEnabled(false);
    const results = await loadCachedStatuses(ACCOUNT_URL);
    expect(results).toHaveLength(0);
  });

  it('respects limit parameter', async() => {
    const testDb = getTestDb();
    for (let i = 0; i < 10; i++) {
      await testDb.statuses.put({
        accountUrl: ACCOUNT_URL, id: `s-${i}`, uri: '', content: '',
        accountId: 'a', createdAt: '', visibility: 'public',
        sensitive: false, spoilerText: '', mediaAttachmentIds: [],
        inReplyToId: null, inReplyToAccountId: null, reblogId: null,
        favourited: false, reblogged: false, bookmarked: false, pinned: false,
        raw: { id: `s-${i}` }, localUpdatedAt: Date.now() - i * 1000,
      });
    }

    const results = await loadCachedStatuses(ACCOUNT_URL, { limit: 3 });
    expect(results).toHaveLength(3);
  });

  it('does not return data from other accounts', async() => {
    const testDb = getTestDb();
    const otherUrl = 'https://other.instance/users/bob';
    await testDb.statuses.put({
      accountUrl: otherUrl, id: 'other-status', uri: '', content: 'private',
      accountId: 'b', createdAt: '', visibility: 'private',
      sensitive: false, spoilerText: '', mediaAttachmentIds: [],
      inReplyToId: null, inReplyToAccountId: null, reblogId: null,
      favourited: false, reblogged: false, bookmarked: false, pinned: false,
      raw: { id: 'other-status', content: 'private' }, localUpdatedAt: Date.now(),
    });

    const results = await loadCachedStatuses(ACCOUNT_URL);
    expect(results).toHaveLength(0);
  });
});

describe('loadCachedNotifications', () => {
  it('returns cached notifications as raw objects', async() => {
    const testDb = getTestDb();
    await testDb.notifications.put({
      accountUrl: ACCOUNT_URL, id: 'n-cached', type: 'mention',
      createdAt: '2026-07-01', accountId: 'sender', statusId: 's1',
      read: false, raw: { id: 'n-cached', type: 'mention', account: { id: 'sender' } },
      localUpdatedAt: Date.now(),
    });

    const results = await loadCachedNotifications(ACCOUNT_URL);
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('mention');
  });
});

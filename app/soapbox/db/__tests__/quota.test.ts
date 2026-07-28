import 'fake-indexeddb/auto';

import {
  getQuotaStatus,
  enforceRetention,
  enforceMaxRecords,
  DEFAULT_RETENTION,
} from '../quota';
import { createAccountScope } from '../repository';


// Override the db import for tests — we need to use our test db
// Since quota.ts imports from ./instance, we mock at module level
jest.mock('../instance', () => {
  const { ManganeDatabase } = jest.requireActual('../schema');
  const testDb = new ManganeDatabase(`quota-test-${Date.now()}-${Math.random()}`);
  return { __esModule: true, default: testDb, db: testDb };
});

// Get the mocked db instance
const getTestDb = (): ManganeDatabase => require('../instance').default;

beforeEach(async() => {
  const testDb = getTestDb();
  await testDb.open();
});

afterEach(async() => {
  const testDb = getTestDb();
  // Clear all tables
  await Promise.all(testDb.tables.map(t => t.clear()));
});

describe('Quota Monitoring', () => {
  it('returns unknown pressure when Storage API is unavailable', async() => {
    // jsdom doesn't have navigator.storage.estimate
    const status = await getQuotaStatus();
    expect(status.pressure).toBe('unknown');
    expect(status.available).toBe(false);
  });

  it('returns structured quota status', async() => {
    const status = await getQuotaStatus();
    expect(status).toHaveProperty('usageBytes');
    expect(status).toHaveProperty('quotaBytes');
    expect(status).toHaveProperty('usageRatio');
    expect(status).toHaveProperty('pressure');
    expect(status).toHaveProperty('available');
    expect(typeof status.usageRatio).toBe('number');
  });
});

describe('TTL-based Retention', () => {
  const scope = createAccountScope('https://example.com/users/retention-test');
  const now = Date.now();

  it('evicts tombstones older than TTL', async() => {
    const testDb = getTestDb();
    const oldTimestamp = now - DEFAULT_RETENTION.tombstoneTtlMs - 1000;

    await testDb.tombstones.bulkPut([
      { accountUrl: scope.accountUrl, id: 'old-tomb', entityType: 'status', deletedAt: oldTimestamp, reason: 'user-action', localUpdatedAt: oldTimestamp },
      { accountUrl: scope.accountUrl, id: 'new-tomb', entityType: 'status', deletedAt: now, reason: 'user-action', localUpdatedAt: now },
    ]);

    const report = await enforceRetention(scope);
    expect(report.trigger).toBe('ttl');
    expect(report.totalEvicted).toBeGreaterThanOrEqual(1);

    // Old tombstone should be gone
    const remaining = await testDb.tombstones.where('accountUrl').equals(scope.accountUrl).toArray();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe('new-tomb');
  });

  it('evicts old notifications but keeps recent ones', async() => {
    const testDb = getTestDb();
    const oldTimestamp = now - DEFAULT_RETENTION.notificationTtlMs - 1000;

    await testDb.notifications.bulkPut([
      { accountUrl: scope.accountUrl, id: 'old-notif', type: 'follow', createdAt: '2020-01-01', accountId: 'a', statusId: null, read: true, raw: {}, localUpdatedAt: oldTimestamp },
      { accountUrl: scope.accountUrl, id: 'new-notif', type: 'mention', createdAt: '2026-07-01', accountId: 'b', statusId: 's1', read: false, raw: {}, localUpdatedAt: now },
    ]);

    const report = await enforceRetention(scope);
    const notifResult = report.results.find(r => r.table === 'notifications');
    expect(notifResult?.evicted).toBe(1);

    const remaining = await testDb.notifications.where('accountUrl').equals(scope.accountUrl).toArray();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe('new-notif');
  });

  it('preserves bookmarked and pinned statuses regardless of age', async() => {
    const testDb = getTestDb();
    const oldTimestamp = now - DEFAULT_RETENTION.statusTtlMs - 1000;

    await testDb.statuses.bulkPut([
      { accountUrl: scope.accountUrl, id: 'old-bookmarked', uri: '', content: '', accountId: 'a', createdAt: '', visibility: 'public', sensitive: false, spoilerText: '', mediaAttachmentIds: [], inReplyToId: null, inReplyToAccountId: null, reblogId: null, favourited: false, reblogged: false, bookmarked: true, pinned: false, raw: {}, localUpdatedAt: oldTimestamp },
      { accountUrl: scope.accountUrl, id: 'old-pinned', uri: '', content: '', accountId: 'a', createdAt: '', visibility: 'public', sensitive: false, spoilerText: '', mediaAttachmentIds: [], inReplyToId: null, inReplyToAccountId: null, reblogId: null, favourited: false, reblogged: false, bookmarked: false, pinned: true, raw: {}, localUpdatedAt: oldTimestamp },
      { accountUrl: scope.accountUrl, id: 'old-normal', uri: '', content: '', accountId: 'a', createdAt: '', visibility: 'public', sensitive: false, spoilerText: '', mediaAttachmentIds: [], inReplyToId: null, inReplyToAccountId: null, reblogId: null, favourited: false, reblogged: false, bookmarked: false, pinned: false, raw: {}, localUpdatedAt: oldTimestamp },
    ]);

    await enforceRetention(scope);

    const remaining = await testDb.statuses.where('accountUrl').equals(scope.accountUrl).toArray();
    const remainingIds = remaining.map(r => r.id);
    expect(remainingIds).toContain('old-bookmarked');
    expect(remainingIds).toContain('old-pinned');
    expect(remainingIds).not.toContain('old-normal');
  });

  it('does not evict records from other accounts', async() => {
    const testDb = getTestDb();
    const otherScope = createAccountScope('https://other.com/users/safe');
    const oldTimestamp = now - DEFAULT_RETENTION.tombstoneTtlMs - 1000;

    await testDb.tombstones.bulkPut([
      { accountUrl: scope.accountUrl, id: 't1', entityType: 'status', deletedAt: oldTimestamp, reason: 'user-action', localUpdatedAt: oldTimestamp },
      { accountUrl: otherScope.accountUrl, id: 't2', entityType: 'status', deletedAt: oldTimestamp, reason: 'user-action', localUpdatedAt: oldTimestamp },
    ]);

    await enforceRetention(scope);

    // Other account's old record should still exist
    const otherRecords = await testDb.tombstones.where('accountUrl').equals(otherScope.accountUrl).toArray();
    expect(otherRecords.length).toBe(1);
  });

  it('returns a report with zero evictions when nothing is expired', async() => {
    const testDb = getTestDb();
    await testDb.notifications.put({
      accountUrl: scope.accountUrl, id: 'fresh', type: 'follow',
      createdAt: new Date().toISOString(), accountId: 'a', statusId: null,
      read: false, raw: {}, localUpdatedAt: now,
    });

    const report = await enforceRetention(scope);
    expect(report.totalEvicted).toBe(0);
    expect(report.results).toHaveLength(0);
  });
});

describe('Max Records Enforcement', () => {
  const scope = createAccountScope('https://example.com/users/maxrec-test');

  it('evicts oldest records when table exceeds limit', async() => {
    const testDb = getTestDb();
    const limit = 5;
    const config = { ...DEFAULT_RETENTION, maxRecordsPerTable: limit };

    // Insert 8 statuses
    const statuses = Array.from({ length: 8 }, (_, i) => ({
      accountUrl: scope.accountUrl,
      id: `s-${i}`,
      uri: '',
      content: '',
      accountId: 'a',
      createdAt: '',
      visibility: 'public' as const,
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
      localUpdatedAt: Date.now() - (8 - i) * 1000, // s-0 is oldest
    }));
    await testDb.statuses.bulkPut(statuses);

    const report = await enforceMaxRecords(scope, config);
    expect(report.totalEvicted).toBe(3); // 8 - 5 = 3 evicted

    const remaining = await testDb.statuses.where('accountUrl').equals(scope.accountUrl).count();
    expect(remaining).toBe(5);
  });

  it('does nothing when under the limit', async() => {
    const testDb = getTestDb();
    const config = { ...DEFAULT_RETENTION, maxRecordsPerTable: 100 };

    await testDb.statuses.put({
      accountUrl: scope.accountUrl, id: 's-only', uri: '', content: '', accountId: 'a',
      createdAt: '', visibility: 'public', sensitive: false, spoilerText: '',
      mediaAttachmentIds: [], inReplyToId: null, inReplyToAccountId: null,
      reblogId: null, favourited: false, reblogged: false, bookmarked: false,
      pinned: false, raw: {}, localUpdatedAt: Date.now(),
    });

    const report = await enforceMaxRecords(scope, config);
    expect(report.totalEvicted).toBe(0);
  });
});

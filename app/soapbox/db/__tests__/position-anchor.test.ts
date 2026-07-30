import 'fake-indexeddb/auto';

import {
  capturePosition,
  restorePosition,
  clearPosition,
  purgePositions,
  getPositionDiagnostics,
} from '../position-anchor';
import { ManganeDatabase } from '../schema';

jest.mock('../instance', () => {
  const { ManganeDatabase } = jest.requireActual('../schema');
  const testDb = new ManganeDatabase(`position-test-${Date.now()}-${Math.random()}`);
  return { __esModule: true, default: testDb, db: testDb };
});

const getTestDb = (): ManganeDatabase => require('../instance').default;

const ALICE = 'https://mastodon.social/users/alice';
const BOB = 'https://mastodon.social/users/bob';

beforeEach(async() => {
  const testDb = getTestDb();
  await testDb.open();
});

afterEach(async() => {
  const testDb = getTestDb();
  await Promise.all(testDb.tables.map(t => t.clear()));
});

describe('capturePosition', () => {
  it('stores a position anchor', async() => {
    await capturePosition(ALICE, 'capture-test-1', 'status-123', -45);
    const restored = await restorePosition(ALICE, 'capture-test-1');
    expect(restored).not.toBeNull();
    expect(restored?.anchorStatusId).toBe('status-123');
    expect(restored?.offsetPixels).toBe(-45);
  });

  it('is throttled — second call within 500ms is ignored', async() => {
    // Use a dedicated timeline so throttle state doesn't interfere with other tests
    await capturePosition(ALICE, 'throttle-test', 'first', 0);
    // Immediate second call to SAME timeline should be throttled
    await capturePosition(ALICE, 'throttle-test', 'second', 10);
    const restored = await restorePosition(ALICE, 'throttle-test');
    expect(restored?.anchorStatusId).toBe('first'); // Second was throttled
  });

  it('does nothing for empty inputs', async() => {
    await capturePosition('', 'home', 'status-1', 0);
    await capturePosition(ALICE, '', 'status-1', 0);
    await capturePosition(ALICE, 'home', '', 0);
    // None should have been stored
    const testDb = getTestDb();
    const count = await testDb.table('positionAnchors').count();
    expect(count).toBe(0);
  });

  it('rounds pixel offset to integer', async() => {
    // Bypass throttle by using different timeline
    await capturePosition(ALICE, 'local:example.com', 'status-1', 12.7);
    const restored = await restorePosition(ALICE, 'local:example.com');
    expect(restored?.offsetPixels).toBe(13);
  });

  it('handles non-finite offset gracefully', async() => {
    await capturePosition(ALICE, 'notifications', 'status-1', Infinity);
    const restored = await restorePosition(ALICE, 'notifications');
    expect(restored?.offsetPixels).toBe(0);
  });
});

describe('restorePosition', () => {
  it('returns null when no anchor exists', async() => {
    const restored = await restorePosition(ALICE, 'home');
    expect(restored).toBeNull();
  });

  it('expires anchors older than 24 hours', async() => {
    const testDb = getTestDb();
    const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
    await testDb.table('positionAnchors').put({
      accountUrl: ALICE,
      timelineId: 'home',
      anchorStatusId: 'old-status',
      offsetPixels: 0,
      capturedAt: oldTimestamp,
      sessionId: 'test',
    });

    const restored = await restorePosition(ALICE, 'home');
    expect(restored).toBeNull();

    // Should have been cleaned up
    const count = await testDb.table('positionAnchors').where('accountUrl').equals(ALICE).count();
    expect(count).toBe(0);
  });

  it('returns valid anchor within 24 hours', async() => {
    const testDb = getTestDb();
    await testDb.table('positionAnchors').put({
      accountUrl: ALICE,
      timelineId: 'home',
      anchorStatusId: 'recent-status',
      offsetPixels: -20,
      capturedAt: Date.now() - (1 * 60 * 60 * 1000), // 1 hour ago
      sessionId: 'test',
    });

    const restored = await restorePosition(ALICE, 'home');
    expect(restored?.anchorStatusId).toBe('recent-status');
    expect(restored?.offsetPixels).toBe(-20);
  });
});

describe('IDOR prevention', () => {
  it('cannot restore another accounts position', async() => {
    const testDb = getTestDb();
    await testDb.table('positionAnchors').put({
      accountUrl: ALICE,
      timelineId: 'home',
      anchorStatusId: 'alice-private',
      offsetPixels: 0,
      capturedAt: Date.now(),
      sessionId: 'test',
    });

    const bobRestore = await restorePosition(BOB, 'home');
    expect(bobRestore).toBeNull();
  });
});

describe('clearPosition', () => {
  it('removes the anchor for a specific timeline', async() => {
    const testDb = getTestDb();
    await testDb.table('positionAnchors').put({
      accountUrl: ALICE, timelineId: 'home', anchorStatusId: 's1',
      offsetPixels: 0, capturedAt: Date.now(), sessionId: 'test',
    });
    await testDb.table('positionAnchors').put({
      accountUrl: ALICE, timelineId: 'notifications', anchorStatusId: 'n1',
      offsetPixels: 0, capturedAt: Date.now(), sessionId: 'test',
    });

    await clearPosition(ALICE, 'home');

    expect(await restorePosition(ALICE, 'home')).toBeNull();
    // Notifications anchor should still exist
    const notifAnchor = await testDb.table('positionAnchors').get([ALICE, 'notifications']);
    expect(notifAnchor).toBeDefined();
  });
});

describe('purgePositions', () => {
  it('removes all anchors for an account without affecting others', async() => {
    const testDb = getTestDb();
    await testDb.table('positionAnchors').bulkPut([
      { accountUrl: ALICE, timelineId: 'home', anchorStatusId: 'a1', offsetPixels: 0, capturedAt: Date.now(), sessionId: 'test' },
      { accountUrl: ALICE, timelineId: 'local:x', anchorStatusId: 'a2', offsetPixels: 0, capturedAt: Date.now(), sessionId: 'test' },
      { accountUrl: BOB, timelineId: 'home', anchorStatusId: 'b1', offsetPixels: 0, capturedAt: Date.now(), sessionId: 'test' },
    ]);

    const deleted = await purgePositions(ALICE);
    expect(deleted).toBe(2);

    // Bob's anchor should survive
    const bobAnchor = await testDb.table('positionAnchors').get([BOB, 'home']);
    expect(bobAnchor).toBeDefined();
  });
});

describe('getPositionDiagnostics', () => {
  it('returns count and oldest age without content', async() => {
    const testDb = getTestDb();
    const oneHourAgo = Date.now() - 3600000;
    await testDb.table('positionAnchors').bulkPut([
      { accountUrl: ALICE, timelineId: 'home', anchorStatusId: 's1', offsetPixels: 0, capturedAt: oneHourAgo, sessionId: 't' },
      { accountUrl: ALICE, timelineId: 'local:x', anchorStatusId: 's2', offsetPixels: 0, capturedAt: Date.now(), sessionId: 't' },
    ]);

    const diag = await getPositionDiagnostics(ALICE);
    expect(diag.count).toBe(2);
    expect(diag.oldestAge).toBeGreaterThanOrEqual(3600000);
    // Verify no content leaks into diagnostics
    const serialized = JSON.stringify(diag);
    expect(serialized).not.toContain('s1');
    expect(serialized).not.toContain('mastodon');
  });

  it('returns zeros for empty state', async() => {
    const diag = await getPositionDiagnostics(ALICE);
    expect(diag.count).toBe(0);
    expect(diag.oldestAge).toBeNull();
  });
});

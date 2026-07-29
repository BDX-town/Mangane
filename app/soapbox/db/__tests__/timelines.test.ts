import 'fake-indexeddb/auto';

import { createAccountScope } from '../repository';
import { ManganeDatabase } from '../schema';
import { TimelineRepository } from '../timelines';

// Mock db instance
jest.mock('../instance', () => {
  const { ManganeDatabase } = jest.requireActual('../schema');
  const testDb = new ManganeDatabase(`timeline-test-${Date.now()}-${Math.random()}`);
  return { __esModule: true, default: testDb, db: testDb };
});

const getTestDb = (): ManganeDatabase => require('../instance').default;

const ALICE = 'https://mastodon.social/users/alice';
const BOB = 'https://mastodon.social/users/bob';

let repo: TimelineRepository;

beforeEach(async() => {
  const testDb = getTestDb();
  await testDb.open();
  repo = new TimelineRepository();
});

afterEach(async() => {
  const testDb = getTestDb();
  await Promise.all(testDb.tables.map(t => t.clear()));
});

describe('Timeline membership', () => {
  const scope = createAccountScope(ALICE);

  it('adds and retrieves members in position order', async() => {
    await repo.addMembers(scope, 'home', [
      { statusId: 's3', position: 3, source: 'pagination' },
      { statusId: 's1', position: 1, source: 'pagination' },
      { statusId: 's2', position: 2, source: 'streaming' },
    ]);

    const members = await repo.getMembers(scope, 'home');
    expect(members.map(m => m.statusId)).toEqual(['s3', 's2', 's1']); // Descending by position
  });

  it('respects limit parameter', async() => {
    await repo.addMembers(scope, 'home', [
      { statusId: 's1', position: 1, source: 'pagination' },
      { statusId: 's2', position: 2, source: 'pagination' },
      { statusId: 's3', position: 3, source: 'pagination' },
    ]);

    const members = await repo.getMembers(scope, 'home', { limit: 2 });
    expect(members).toHaveLength(2);
    expect(members[0].statusId).toBe('s3'); // Newest first
  });

  it('isolates timelines from each other', async() => {
    await repo.addMembers(scope, 'home', [{ statusId: 's1', position: 1, source: 'pagination' }]);
    await repo.addMembers(scope, 'notifications', [{ statusId: 'n1', position: 1, source: 'pagination' }]);

    const home = await repo.getMembers(scope, 'home');
    const notifs = await repo.getMembers(scope, 'notifications');
    expect(home).toHaveLength(1);
    expect(notifs).toHaveLength(1);
    expect(home[0].statusId).toBe('s1');
    expect(notifs[0].statusId).toBe('n1');
  });

  it('IDOR: cannot read another account timeline', async() => {
    const aliceScope = createAccountScope(ALICE);
    const bobScope = createAccountScope(BOB);

    await repo.addMembers(aliceScope, 'home', [{ statusId: 'alice-s1', position: 1, source: 'pagination' }]);
    const bobHome = await repo.getMembers(bobScope, 'home');
    expect(bobHome).toHaveLength(0);
  });
});

describe('Timeline cursors', () => {
  const scope = createAccountScope(ALICE);

  it('saves and retrieves a cursor', async() => {
    await repo.saveCursor(scope, {
      timelineId: 'home',
      maxId: '12345',
      minId: '67890',
      hasOlder: true,
      hasNewer: false,
      updatedAt: Date.now(),
    });

    const cursor = await repo.getCursor(scope, 'home');
    expect(cursor?.maxId).toBe('12345');
    expect(cursor?.minId).toBe('67890');
    expect(cursor?.hasOlder).toBe(true);
  });

  it('returns undefined for missing cursor', async() => {
    const cursor = await repo.getCursor(scope, 'nonexistent');
    expect(cursor).toBeUndefined();
  });

  it('IDOR: cannot read another accounts cursor', async() => {
    const bobScope = createAccountScope(BOB);
    await repo.saveCursor(scope, {
      timelineId: 'home', maxId: 'x', minId: null, hasOlder: true, hasNewer: false, updatedAt: Date.now(),
    });
    const cursor = await repo.getCursor(bobScope, 'home');
    expect(cursor).toBeUndefined();
  });
});

describe('Timeline gaps', () => {
  const scope = createAccountScope(ALICE);

  it('records and retrieves unfilled gaps', async() => {
    await repo.addGap(scope, {
      timelineId: 'home',
      gapId: 'gap-1',
      aboveStatusId: 's10',
      belowStatusId: 's5',
      fillCursor: 's10',
      detectedAt: Date.now(),
      filled: false,
    });

    const gaps = await repo.getUnfilledGaps(scope, 'home');
    expect(gaps).toHaveLength(1);
    expect(gaps[0].gapId).toBe('gap-1');
    expect(gaps[0].fillCursor).toBe('s10');
  });

  it('marks a gap as filled', async() => {
    await repo.addGap(scope, {
      timelineId: 'home', gapId: 'gap-2', aboveStatusId: 's20',
      belowStatusId: 's15', fillCursor: 's20', detectedAt: Date.now(), filled: false,
    });

    await repo.markGapFilled(scope, 'home', 'gap-2');
    const gaps = await repo.getUnfilledGaps(scope, 'home');
    expect(gaps).toHaveLength(0);
  });
});

describe('Timeline purge', () => {
  it('removes all timeline data for an account', async() => {
    const scope = createAccountScope(ALICE);
    const otherScope = createAccountScope(BOB);

    await repo.addMembers(scope, 'home', [{ statusId: 's1', position: 1, source: 'pagination' }]);
    await repo.saveCursor(scope, { timelineId: 'home', maxId: 'x', minId: null, hasOlder: true, hasNewer: false, updatedAt: Date.now() });
    await repo.addMembers(otherScope, 'home', [{ statusId: 'b1', position: 1, source: 'pagination' }]);

    const deleted = await repo.purgeAccount(scope);
    expect(deleted).toBeGreaterThanOrEqual(2);

    // Alice's data is gone
    expect(await repo.getMembers(scope, 'home')).toHaveLength(0);
    // Bob's data is intact
    expect(await repo.getMembers(otherScope, 'home')).toHaveLength(1);
  });
});

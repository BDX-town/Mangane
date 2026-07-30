import 'fake-indexeddb/auto';

import { createAccountScope, statusesRepo } from '../repository';
import { ManganeDatabase } from '../schema';
import { loadTimelineWindow } from '../timeline-window';
import { TimelineRepository } from '../timelines';

jest.mock('../instance', () => {
  const { ManganeDatabase } = jest.requireActual('../schema');
  const testDb = new ManganeDatabase(`timeline-window-test-${Date.now()}-${Math.random()}`);
  return { __esModule: true, default: testDb, db: testDb };
});

const getTestDb = (): ManganeDatabase => require('../instance').default;
const ALICE = 'https://mastodon.social/users/alice';
const BOB = 'https://mastodon.social/users/bob';

const status = (id: string) => ({
  id,
  uri: `https://origin.example/statuses/${id}`,
  content: id,
  accountId: 'author',
  createdAt: '2026-07-29T00:00:00.000Z',
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
  raw: { id },
});

beforeEach(async() => {
  await getTestDb().open();
});

afterEach(async() => {
  await Promise.all(getTestDb().tables.map(table => table.clear()));
});

describe('loadTimelineWindow', () => {
  it('hydrates statuses in canonical membership order around an anchor', async() => {
    const scope = createAccountScope(ALICE);
    const timelineRepo = new TimelineRepository();

    await statusesRepo.putMany(scope, ['s1', 's2', 's3', 's4', 's5'].map(status));
    await timelineRepo.addMembers(scope, 'home', [
      { statusId: 's1', position: 1, source: 'pagination' },
      { statusId: 's2', position: 2, source: 'pagination' },
      { statusId: 's3', position: 3, source: 'pagination' },
      { statusId: 's4', position: 4, source: 'pagination' },
      { statusId: 's5', position: 5, source: 'streaming' },
    ]);

    const window = await loadTimelineWindow(scope, 'home', {
      anchorStatusId: 's3',
      before: 1,
      after: 1,
    });

    expect(window.members.map(member => member.statusId)).toEqual(['s4', 's3', 's2']);
    expect(window.statuses.map(item => item?.id)).toEqual(['s4', 's3', 's2']);
    expect(window.anchorIndex).toBe(1);
    expect(window.missingStatusIds).toEqual([]);
  });

  it('selects neighboring members by rank when positions are sparse', async() => {
    const scope = createAccountScope(ALICE);
    const timelineRepo = new TimelineRepository();

    await statusesRepo.putMany(scope, ['newer', 'anchor', 'older'].map(status));
    await timelineRepo.addMembers(scope, 'home', [
      { statusId: 'newer', position: 100, source: 'streaming' },
      { statusId: 'anchor', position: 50, source: 'pagination' },
      { statusId: 'older', position: -25, source: 'pagination' },
    ]);

    const window = await loadTimelineWindow(scope, 'home', {
      anchorStatusId: 'anchor',
      before: 1,
      after: 1,
    });

    expect(window.members.map(member => member.statusId)).toEqual(['newer', 'anchor', 'older']);
    expect(window.anchorIndex).toBe(1);
  });

  it('resolves a deep status anchor before applying bounded output limits', async() => {
    const scope = createAccountScope(ALICE);
    const timelineRepo = new TimelineRepository();
    const ids = Array.from({ length: 180 }, (_, index) => `s${index + 1}`);

    await statusesRepo.putMany(scope, ids.map(status));
    await timelineRepo.addMembers(scope, 'home', ids.map((statusId, index) => ({
      statusId,
      position: index + 1,
      source: 'pagination' as const,
    })));

    const window = await loadTimelineWindow(scope, 'home', {
      anchorStatusId: 's20',
      before: 2,
      after: 2,
    });

    expect(window.members.map(member => member.statusId)).toEqual(['s22', 's21', 's20', 's19', 's18']);
    expect(window.anchorIndex).toBe(2);
  });

  it('reports missing cached statuses without changing order', async() => {
    const scope = createAccountScope(ALICE);
    const timelineRepo = new TimelineRepository();

    await statusesRepo.putMany(scope, [status('s1'), status('s3')]);
    await timelineRepo.addMembers(scope, 'home', [
      { statusId: 's1', position: 1, source: 'pagination' },
      { statusId: 's2', position: 2, source: 'pagination' },
      { statusId: 's3', position: 3, source: 'pagination' },
    ]);

    const window = await loadTimelineWindow(scope, 'home', {
      anchorStatusId: 's2',
      before: 1,
      after: 1,
    });

    expect(window.statuses.map(item => item?.id)).toEqual(['s3', undefined, 's1']);
    expect(window.missingStatusIds).toEqual(['s2']);
  });

  it('returns cursor and unfilled-gap reconstruction context', async() => {
    const scope = createAccountScope(ALICE);
    const timelineRepo = new TimelineRepository();

    await timelineRepo.saveCursor(scope, {
      timelineId: 'home',
      maxId: 'older',
      minId: 'newer',
      hasOlder: true,
      hasNewer: false,
      updatedAt: Date.now(),
    });
    await timelineRepo.addGap(scope, {
      timelineId: 'home',
      gapId: 'gap-1',
      aboveStatusId: 's10',
      belowStatusId: 's5',
      fillCursor: 's10',
      detectedAt: Date.now(),
      filled: false,
    });

    const window = await loadTimelineWindow(scope, 'home');
    expect(window.cursor?.maxId).toBe('older');
    expect(window.gaps.map(gap => gap.gapId)).toEqual(['gap-1']);
  });

  it('prevents cross-account anchor and timeline hydration', async() => {
    const aliceScope = createAccountScope(ALICE);
    const bobScope = createAccountScope(BOB);
    const timelineRepo = new TimelineRepository();

    await statusesRepo.put(aliceScope, status('alice-s1'));
    await timelineRepo.addMembers(aliceScope, 'home', [
      { statusId: 'alice-s1', position: 1, source: 'pagination' },
    ]);

    const bobWindow = await loadTimelineWindow(bobScope, 'home', { anchorStatusId: 'alice-s1' });
    expect(bobWindow.members).toEqual([]);
    expect(bobWindow.statuses).toEqual([]);
  });

  it('rejects malformed bounds and identifiers and caps excessive sides', async() => {
    const scope = createAccountScope(ALICE);
    await expect(loadTimelineWindow(scope, 'home', { before: -1 })).rejects.toThrow(RangeError);
    await expect(loadTimelineWindow(scope, 'home', { after: 1.5 })).rejects.toThrow(RangeError);
    await expect(loadTimelineWindow(scope, 'home', { anchorPosition: Number.MAX_VALUE })).rejects.toThrow(RangeError);
    await expect(loadTimelineWindow(scope, '   ')).rejects.toThrow(RangeError);
    await expect(loadTimelineWindow(scope, 'home', { anchorStatusId: '\u0000bad' })).rejects.toThrow(RangeError);
  });
});

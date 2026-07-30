import { statusesRepo } from './repository';
import { timelineRepo } from './timelines';

import type { AccountScope } from './repository';
import type { StoredStatus } from './schema';
import type { TimelineCursor, TimelineGap, TimelineMember } from './timelines';

const DEFAULT_WINDOW_BEFORE = 20;
const DEFAULT_WINDOW_AFTER = 20;
const MAX_WINDOW_SIDE = 100;
const MAX_TIMELINE_ID_LENGTH = 512;

export interface TimelineWindowRequest {
  readonly anchorStatusId?: string;
  readonly anchorPosition?: number;
  readonly before?: number;
  readonly after?: number;
}

export interface TimelineWindow {
  readonly members: TimelineMember[];
  readonly statuses: Array<StoredStatus | undefined>;
  readonly missingStatusIds: string[];
  readonly anchorIndex: number | null;
  readonly cursor?: TimelineCursor;
  readonly gaps: TimelineGap[];
}

function containsControlCharacter(value: string): boolean {
  return Array.from(value).some(character => {
    const codePoint = character.codePointAt(0);
    return codePoint !== undefined && (codePoint <= 0x1f || codePoint === 0x7f);
  });
}

function validateIdentifier(value: string, label: string, maxLength = MAX_TIMELINE_ID_LENGTH): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength || containsControlCharacter(normalized)) {
    throw new RangeError(`${label} must be a non-empty bounded identifier without control characters`);
  }
  return normalized;
}

function clampWindowSide(value: number | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError('Timeline window sizes must be non-negative safe integers');
  }
  return Math.min(value, MAX_WINDOW_SIDE);
}

function validateAnchorPosition(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isSafeInteger(value)) {
    throw new RangeError('Timeline anchor position must be a safe integer');
  }
  return value;
}

/**
 * Hydrates a bounded, account-scoped timeline window in canonical membership
 * order. Neighbors are selected by sorted rank rather than position arithmetic,
 * so sparse, negative, or otherwise non-contiguous ordering keys are safe.
 */
export async function loadTimelineWindow(
  scope: AccountScope,
  timelineIdInput: string,
  request: TimelineWindowRequest = {},
): Promise<TimelineWindow> {
  const timelineId = validateIdentifier(timelineIdInput, 'Timeline ID');
  const anchorStatusId = request.anchorStatusId === undefined
    ? undefined
    : validateIdentifier(request.anchorStatusId, 'Anchor status ID');
  const anchorPosition = validateAnchorPosition(request.anchorPosition);
  const before = clampWindowSide(request.before, DEFAULT_WINDOW_BEFORE);
  const after = clampWindowSide(request.after, DEFAULT_WINDOW_AFTER);

  const [{ members, anchorIndex }, cursor, gaps] = await Promise.all([
    timelineRepo.getWindowByRank(scope, timelineId, {
      anchorStatusId,
      anchorPosition,
      before,
      after,
    }),
    timelineRepo.getCursor(scope, timelineId),
    timelineRepo.getUnfilledGaps(scope, timelineId),
  ]);

  if (members.length === 0) {
    return {
      members: [],
      statuses: [],
      missingStatusIds: [],
      anchorIndex: null,
      cursor,
      gaps,
    };
  }

  const statuses = await statusesRepo.getMany(scope, members.map(member => member.statusId));
  const missingStatusIds = members
    .filter((_, index) => statuses[index] === undefined)
    .map(member => member.statusId);

  return {
    members,
    statuses,
    missingStatusIds,
    anchorIndex,
    cursor,
    gaps,
  };
}

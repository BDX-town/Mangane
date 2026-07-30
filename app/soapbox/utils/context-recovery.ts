import type { APIEntity } from 'soapbox/types/entities';

const DEFAULT_MAX_ANCESTOR_DEPTH = 40;
const MAX_STATUS_ID_LENGTH = 512;

type ContextStatus = APIEntity & {
  id: string,
  in_reply_to_id?: string | null,
};

type FetchStatusById = (id: string) => Promise<ContextStatus>;

/** Stable outcomes consumed by thread presentation and future recovery policy. */
export type ContextRecoveryOutcome =
  | 'complete'
  | 'repaired'
  | 'partial-unavailable'
  | 'partial-unauthorized'
  | 'partial-network'
  | 'partial-malformed'
  | 'cycle-detected'
  | 'depth-truncated';

export interface ContextRecoveryResult {
  ancestors: ContextStatus[];
  fetched: ContextStatus[];
  outcome: ContextRecoveryOutcome;
  missingParentId?: string;
}

interface ContextRecoveryOptions {
  focusedStatus: ContextStatus;
  knownStatuses: ContextStatus[];
  fetchStatusById: FetchStatusById;
  maxDepth?: number;
}

const isUsableStatusId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && value.length <= MAX_STATUS_ID_LENGTH;

const getHttpStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== 'object') return undefined;
  const response = Reflect.get(error, 'response');
  if (!response || typeof response !== 'object') return undefined;
  const status = Reflect.get(response, 'status');
  return typeof status === 'number' ? status : undefined;
};

const classifyFetchFailure = (error: unknown): ContextRecoveryOutcome => {
  const status = getHttpStatus(error);
  if (status === 401 || status === 403) return 'partial-unauthorized';
  if (status === 404 || status === 410) return 'partial-unavailable';
  return 'partial-network';
};

/**
 * Builds the connected root-to-parent chain for a focused status.
 *
 * Known context is always preferred, including Mitra's array-shaped context.
 * Only missing links are fetched. Recovery is bounded, cycle-safe, and rejects
 * mismatched entities so a hostile or corrupt server cannot splice another
 * status into the conversation.
 */
const recoverAncestorContext = async({
  focusedStatus,
  knownStatuses,
  fetchStatusById,
  maxDepth = DEFAULT_MAX_ANCESTOR_DEPTH,
}: ContextRecoveryOptions): Promise<ContextRecoveryResult> => {
  if (!isUsableStatusId(focusedStatus.id)) {
    return { ancestors: [], fetched: [], outcome: 'partial-malformed' };
  }

  const knownById = new Map<string, ContextStatus>();
  knownStatuses.forEach(status => {
    if (isUsableStatusId(status.id)) knownById.set(status.id, status);
  });

  const visited = new Set<string>([focusedStatus.id]);
  const nearestFirst: ContextStatus[] = [];
  const fetched: ContextStatus[] = [];
  let parentId = focusedStatus.in_reply_to_id;

  if (!parentId) {
    return { ancestors: [], fetched, outcome: 'complete' };
  }

  for (let depth = 0; depth < maxDepth; depth += 1) {
    if (!isUsableStatusId(parentId)) {
      return {
        ancestors: nearestFirst.reverse(),
        fetched,
        outcome: 'partial-malformed',
      };
    }

    if (visited.has(parentId)) {
      return {
        ancestors: nearestFirst.reverse(),
        fetched,
        outcome: 'cycle-detected',
        missingParentId: parentId,
      };
    }
    visited.add(parentId);

    let parent = knownById.get(parentId);
    if (!parent) {
      try {
        const candidate = await fetchStatusById(parentId);
        if (!candidate || candidate.id !== parentId) {
          return {
            ancestors: nearestFirst.reverse(),
            fetched,
            outcome: 'partial-malformed',
            missingParentId: parentId,
          };
        }
        parent = candidate;
        fetched.push(candidate);
        knownById.set(candidate.id, candidate);
      } catch (error) {
        return {
          ancestors: nearestFirst.reverse(),
          fetched,
          outcome: classifyFetchFailure(error),
          missingParentId: parentId,
        };
      }
    }

    nearestFirst.push(parent);
    parentId = parent.in_reply_to_id;

    if (!parentId) {
      return {
        ancestors: nearestFirst.reverse(),
        fetched,
        outcome: fetched.length > 0 ? 'repaired' : 'complete',
      };
    }
  }

  return {
    ancestors: nearestFirst.reverse(),
    fetched,
    outcome: 'depth-truncated',
    missingParentId: isUsableStatusId(parentId) ? parentId : undefined,
  };
};

export {
  DEFAULT_MAX_ANCESTOR_DEPTH,
  MAX_STATUS_ID_LENGTH,
  recoverAncestorContext,
};

import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSelector } from 'reselect';

import { fetchStatusWithContext, fetchNext } from 'soapbox/actions/statuses';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';

import type { RootState } from 'soapbox/store';

const getStatus = makeGetStatus();

const getAncestorsIds = createSelector([
  (_: RootState, statusId: string | undefined) => statusId,
  (state: RootState) => state.contexts.inReplyTos,
], (statusId, inReplyTos) => {
  let ancestorsIds = ImmutableOrderedSet<string>();
  let id: string | undefined = statusId;

  while (id && !ancestorsIds.includes(id)) {
    ancestorsIds = ImmutableOrderedSet([id]).union(ancestorsIds);
    id = inReplyTos.get(id);
  }

  return ancestorsIds;
});

const getDescendantsIds = createSelector([
  (_: RootState, statusId: string) => statusId,
  (state: RootState) => state.contexts.replies,
], (statusId, contextReplies) => {
  let descendantsIds = ImmutableOrderedSet<string>();
  const ids = [statusId];

  while (ids.length > 0) {
    const id = ids.shift();
    if (!id) break;

    const replies = contextReplies.get(id);

    if (descendantsIds.includes(id)) {
      break;
    }

    if (statusId !== id) {
      descendantsIds = descendantsIds.union([id]);
    }

    if (replies) {
      replies.reverse().forEach((reply: string) => {
        ids.unshift(reply);
      });
    }
  }

  return descendantsIds;
});

export const useThread = (statusId: string) => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(state => getStatus(state, { id: statusId }));
  // yes this is ugly but this thing spams renders otherwise...
  const statusKeys = useMemo(() => JSON.stringify(status), [status]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actualStatus = useMemo(() => status, [statusKeys]);

  const { ancestorsIds, descendantsIds } = useAppSelector(state => {
    let ancestorsIds = ImmutableOrderedSet<string>();
    let descendantsIds = ImmutableOrderedSet<string>();

    if (actualStatus) {
      const id = actualStatus.id;
      ancestorsIds = getAncestorsIds(state, state.contexts.inReplyTos.get(id));
      descendantsIds = getDescendantsIds(state, id);
      ancestorsIds = ancestorsIds.delete(id).subtract(descendantsIds);
      descendantsIds = descendantsIds.delete(id).subtract(ancestorsIds);
    }

    return { ancestorsIds, descendantsIds };
  });

  const [isLoaded, setIsLoaded] = useState<boolean>(!!actualStatus);
  const [next, setNext] = useState<string | undefined>();

  const fetchDataRef = useRef<number>(0);

  const fetchData = useCallback(async () => {
    try {
      const time = new Date().getTime();
      fetchDataRef.current = time;
      const { next } = await dispatch(fetchStatusWithContext(statusId));
      if (time < fetchDataRef.current) return;
      setNext(next);
      setIsLoaded(true);
    } catch (e) {
      console.error(e);
      setIsLoaded(true);
    }
  }, [dispatch, statusId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData, statusId]);

  const handleRefresh = useCallback(() => fetchData(), [fetchData]);

  const handleLoadMore = useCallback(async () => {
    if (!next || !actualStatus) return;
    try {
      const { next: _next } = await dispatch(fetchNext(actualStatus.id, next));
      setNext(_next);
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, next, actualStatus]);

  const handleLoadMoreDebounced = useMemo(
    () => debounce(handleLoadMore, 300, { leading: true }),
    [handleLoadMore],
  );

  return {
    actualStatus,
    ancestorsIds,
    descendantsIds,
    isLoaded,
    next,
    handleRefresh,
    handleLoadMore: handleLoadMoreDebounced,
  };
};

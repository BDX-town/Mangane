/**
 * List normalizer:
 * Converts API lists into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/list/}
 */
import { Record as ImmutableRecord, Map as ImmutableMap, fromJS } from 'immutable';

// https://docs.joinmastodon.org/entities/list/
export const ListRecord = ImmutableRecord({
  id: '',
  title: '',
  replies_policy: null as 'followed' | 'list' | 'none' | null,
});

export const normalizeList = (list: Record<string, any>) => {
  return ListRecord(
    ImmutableMap(fromJS(list)),
  );
};

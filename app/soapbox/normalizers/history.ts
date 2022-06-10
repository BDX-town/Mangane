/**
 * History normalizer:
 * Converts API daily usage history of a hashtag into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/history/}
 */
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

// https://docs.joinmastodon.org/entities/history/
export const HistoryRecord = ImmutableRecord({
  accounts: '',
  day: '',
  uses: '',
});
export const normalizeHistory = (history: Record<string, any>) => {
  return HistoryRecord(
    ImmutableMap(fromJS(history)),
  );
};

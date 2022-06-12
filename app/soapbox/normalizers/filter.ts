/**
 * Filter normalizer:
 * Converts API filters into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/filter/}
 */
import { List as ImmutableList, Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';

// https://docs.joinmastodon.org/entities/filter/
export const FilterRecord = ImmutableRecord({
  id: '',
  phrase: '',
  context: ImmutableList<string>(),
  whole_word: false,
  expires_at: '',
  irreversible: false,
});

export const normalizeFilter = (filter: Record<string, any>) => {
  return FilterRecord(
    ImmutableMap(fromJS(filter)),
  );
};
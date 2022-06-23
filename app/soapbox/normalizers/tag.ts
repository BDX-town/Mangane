/**
 * Tag normalizer:
 * Converts API tags into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/tag/}
 */
import {
  List as ImmutableList,
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import { normalizeHistory } from './history';

import type { History } from 'soapbox/types/entities';

// https://docs.joinmastodon.org/entities/tag/
export const TagRecord = ImmutableRecord({
  name: '',
  url: '',
  history: null as ImmutableList<History> | null,
});

const normalizeHistoryList = (tag: ImmutableMap<string, any>) => {
  if (tag.get('history')){
    return tag.update('history', ImmutableList(), attachments => {
      return attachments.map(normalizeHistory);
    });
  } else {
    return tag.set('history', null);
  }
};

export const normalizeTag = (tag: Record<string, any>) => {
  return TagRecord(
    ImmutableMap(fromJS(tag)).withMutations(tag => {
      normalizeHistoryList(tag);
    }),
  );
};

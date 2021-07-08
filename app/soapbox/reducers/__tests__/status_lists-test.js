import reducer from '../status_lists';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

describe('status_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      favourites: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableOrderedSet(),
      }),
      bookmarks: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableOrderedSet(),
      }),
      pins: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableOrderedSet(),
      }),
      scheduled_statuses: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableOrderedSet(),
      }),
    }));
  });
});

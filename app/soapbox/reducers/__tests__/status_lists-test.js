import reducer from '../status_lists';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('status_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      favourites: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableList(),
      }),
      bookmarks: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableList(),
      }),
      pins: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableList(),
      }),
      scheduled_statuses: ImmutableMap({
        next: null,
        loaded: false,
        items: ImmutableList(),
      }),
    }));
  });
});

import reducer from '../list_editor';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('list_editor reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      listId: null,
      isSubmitting: false,
      isChanged: false,
      title: '',

      accounts: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),

      suggestions: ImmutableMap({
        value: '',
        items: ImmutableList(),
      }),
    }));
  });
});

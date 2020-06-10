import reducer from '../group_editor';
import { Map as ImmutableMap } from 'immutable';

describe('group_editor reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      groupId: null,
      isSubmitting: false,
      isChanged: false,
      title: '',
      description: '',
      coverImage: null,
    }));
  });
});

import { Map as ImmutableMap } from 'immutable';

import reducer from '../group_editor';

describe('group_editor reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(ImmutableMap({
      groupId: null,
      isSubmitting: false,
      isChanged: false,
      title: '',
      description: '',
      coverImage: null,
    }));
  });
});

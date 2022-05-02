import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import reducer from '../reports';

describe('reports reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      new: ImmutableMap({
        isSubmitting: false,
        account_id: null,
        status_ids: ImmutableSet(),
        comment: '',
        forward: false,
        block: false,
        rule_ids: ImmutableSet(),
      }),
    }));
  });
});

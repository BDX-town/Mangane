import reducer from '../mutes';
import { Map as ImmutableMap } from 'immutable';

describe('mutes reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      new: ImmutableMap({
        isSubmitting: false,
        account: null,
        notifications: true,
      }),
    }));
  });
});

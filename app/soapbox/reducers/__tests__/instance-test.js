import reducer from '../instance';
import { Map as ImmutableMap } from 'immutable';

describe('instance reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      max_toot_chars: 500,
      poll_limits: ImmutableMap({
        max_expiration: 2629746,
        max_option_chars: 25,
        max_options: 4,
        min_expiration: 300,
      }),
    }));
  });
});

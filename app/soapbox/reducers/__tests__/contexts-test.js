import reducer from '../contexts';
import { Map as ImmutableMap } from 'immutable';

describe('contexts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      inReplyTos: ImmutableMap(),
      replies: ImmutableMap(),
    }));
  });
});

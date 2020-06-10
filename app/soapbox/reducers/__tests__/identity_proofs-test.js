import reducer from '../identity_proofs';
import { Map as ImmutableMap } from 'immutable';

describe('identity_proofs reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

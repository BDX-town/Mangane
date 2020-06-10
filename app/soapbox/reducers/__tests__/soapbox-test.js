import reducer from '../soapbox';
import { Map as ImmutableMap } from 'immutable';

describe('soapbox reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

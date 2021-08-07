import reducer from '../search';
import { Map as ImmutableMap } from 'immutable';

describe('search reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      value: '',
      submitted: false,
      submittedValue: '',
      hidden: false,
      results: ImmutableMap(),
      filter: 'accounts',
    }));
  });
});

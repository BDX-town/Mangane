import reducer from '../admin';
import { fromJS } from 'immutable';

describe('admin reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(fromJS({
      reports: [],
      open_report_count: 0,
    }));
  });
});

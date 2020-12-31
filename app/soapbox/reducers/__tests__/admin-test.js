import reducer from '../admin';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
} from 'immutable';

describe('admin reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      reports: ImmutableMap(),
      openReports: ImmutableOrderedSet(),
      users: ImmutableMap(),
      awaitingApproval: ImmutableOrderedSet(),
      configs: ImmutableList(),
      needsReboot: false,
    });
  });
});

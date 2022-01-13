import { Map as ImmutableMap, fromJS } from 'immutable';

import lain from 'soapbox/__fixtures__/lain.json';

import {
  ACCOUNT_IMPORT,
} from '../../actions/importer';
import reducer from '../relationships';

describe('relationships reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  describe('ACCOUNT_IMPORT', () => {
    it('should import the relationship', () => {
      const action = {
        type: ACCOUNT_IMPORT,
        account: lain,
      };
      const state = ImmutableMap();
      expect(reducer(state, action)).toEqual(fromJS({
        '9v5bqYwY2jfmvPNhTM': {
          blocked_by: false,
          blocking: false,
          domain_blocking: false,
          endorsed: false,
          followed_by: true,
          following: true,
          id: '9v5bqYwY2jfmvPNhTM',
          muting: false,
          muting_notifications: false,
          requested: false,
          showing_reblogs: true,
          subscribing: false,
        },
      }));
    });
  });
});

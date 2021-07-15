import reducer from '../accounts';
import { Map as ImmutableMap } from 'immutable';
// import * as actions from 'soapbox/actions/importer';
// import { take } from 'lodash';
// import accounts from 'soapbox/__fixtures__/accounts.json';

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  // it('should handle ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', () => {
  //   const state = ImmutableMap({ username: 'curtis' });
  //   const action = {
  //     type: actions.ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
  //     username: 'curtis',
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     username: 'curtis',
  //   });
  // });

});

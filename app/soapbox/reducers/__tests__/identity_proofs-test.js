import { Map as ImmutableMap } from 'immutable';

import * as actions from 'soapbox/actions/identity_proofs';

import reducer from '../identity_proofs';

describe('identity_proofs reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  it('should handle IDENTITY_PROOFS_ACCOUNT_FETCH_REQUEST', () => {
    const state = ImmutableMap({ isLoading: false });
    const action = {
      type: actions.IDENTITY_PROOFS_ACCOUNT_FETCH_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      isLoading: true,
    });
  });

  it('should handle IDENTITY_PROOFS_ACCOUNT_FETCH_FAIL', () => {
    const state = ImmutableMap({ isLoading: true });
    const action = {
      type: actions.IDENTITY_PROOFS_ACCOUNT_FETCH_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      isLoading: false,
    });
  });

});

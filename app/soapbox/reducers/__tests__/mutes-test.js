import { Map as ImmutableMap } from 'immutable';

import {
  MUTES_INIT_MODAL,
  MUTES_TOGGLE_HIDE_NOTIFICATIONS,
} from 'soapbox/actions/mutes';

import reducer from '../mutes';

describe('mutes reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      new: ImmutableMap({
        isSubmitting: false,
        account: null,
        notifications: true,
      }),
    }));
  });

  it('should handle MUTES_INIT_MODAL', () => {
    const state = ImmutableMap({
      new: ImmutableMap({
        isSubmitting: false,
        account: null,
        notifications: true,
      }),
    });
    const action = {
      type: MUTES_INIT_MODAL,
      account: 'account1',
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      new: ImmutableMap({
        isSubmitting: false,
        account: 'account1',
        notifications: true,
      }),
    }));
  });

  it('should handle MUTES_TOGGLE_HIDE_NOTIFICATIONS', () => {
    const state = ImmutableMap({
      new: ImmutableMap({
        notifications: true,
      }),
    });
    const action = {
      type: MUTES_TOGGLE_HIDE_NOTIFICATIONS,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      new: ImmutableMap({
        notifications: false,
      }),
    }));
  });

});

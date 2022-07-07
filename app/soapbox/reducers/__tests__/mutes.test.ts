import { Record as ImmutableRecord } from 'immutable';

import {
  MUTES_INIT_MODAL,
  MUTES_TOGGLE_HIDE_NOTIFICATIONS,
} from 'soapbox/actions/mutes';

import reducer from '../mutes';

describe('mutes reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any).toJS()).toEqual({
      new: {
        isSubmitting: false,
        accountId: null,
        notifications: true,
      },
    });
  });

  it('should handle MUTES_INIT_MODAL', () => {
    const state = ImmutableRecord({
      new: ImmutableRecord({
        isSubmitting: false,
        accountId: null,
        notifications: true,
      })(),
    })();
    const action = {
      type: MUTES_INIT_MODAL,
      account: { id: 'account1' },
    };
    expect(reducer(state, action).toJS()).toEqual({
      new: {
        isSubmitting: false,
        accountId: 'account1',
        notifications: true,
      },
    });
  });

  it('should handle MUTES_TOGGLE_HIDE_NOTIFICATIONS', () => {
    const state = ImmutableRecord({
      new: ImmutableRecord({
        isSubmitting: false,
        accountId: null,
        notifications: true,
      })(),
    })();
    const action = {
      type: MUTES_TOGGLE_HIDE_NOTIFICATIONS,
    };
    expect(reducer(state, action).toJS()).toEqual({
      new: {
        isSubmitting: false,
        accountId: null,
        notifications: false,
      },
    });
  });

});

import { List as ImmutableList } from 'immutable';

import * as actions from 'soapbox/actions/alerts';

import reducer from '../alerts';

describe('alerts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableList());
  });

  it('should handle ALERT_SHOW', () => {
    const state = ImmutableList([]);
    const action = {
      type: actions.ALERT_SHOW,
      title: 'alert_title',
      message: 'this is an alert message',
    };
    expect(reducer(state, action).toJS()).toMatchObject([
      {
        key: 0,
        message: 'this is an alert message',
        title: 'alert_title',
      },
    ]);
  });

  // it('should handle ALERT_DISMISS', () => {
  //   const state = ImmutableList([
  //     {
  //       key: 0,
  //       message: 'message_1',
  //       title: 'title_1',
  //     },
  //     {
  //       key: 1,
  //       message: 'message_2',
  //       title: 'title_2',
  //     },
  //   ]);
  //   const action = {
  //     type: actions.ALERT_DISMISS,
  //     alert: { key: 0 },
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject([
  //     {
  //       key: 1,
  //       message: 'message_2',
  //       title: 'title_2',
  //     }
  //   ]);
  // });

  it('should handle ALERT_CLEAR', () => {
    const state = ImmutableList([
      {
        key: 0,
        message: 'message_1',
        title: 'title_1',
      },
      {
        key: 1,
        message: 'message_2',
        title: 'title_2',
      },
    ]);
    const action = {
      type: actions.ALERT_CLEAR,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
    });
  });

});

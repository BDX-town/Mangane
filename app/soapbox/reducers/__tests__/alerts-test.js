import reducer from '../alerts';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import * as actions from '../alerts';

describe('alerts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableList());
  });

  it('should handle ALERT_SHOW', () => {
    const state = ImmutableMap({ key: 2 });
    const action = {
      type: actions.ALERT_SHOW,
      title: 'alert_title',
      message: 'this is an alert message',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      key: 2,
    });
  });

  it('should handle ALERT_DISMISS', () => {
    const state = ImmutableMap({ key: 2 });
    const action = {
      type: actions.ALERT_DISMISS,
      key: 2,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      key: 2,
    });
  });

  it('should handle ALERT_CLEAR', () => {
    const state = ImmutableMap({ });
    const action = {
      type: actions.ALERT_CLEAR,
      key: 2,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
    });
  });

});

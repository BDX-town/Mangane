import { Record as ImmutableRecord, List as ImmutableList } from 'immutable';

import {
  ALERT_SHOW,
  ALERT_DISMISS,
  ALERT_CLEAR,
} from 'soapbox/actions/alerts';
import { applyActions } from 'soapbox/jest/test-helpers';

import reducer from '../alerts';

describe('alerts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableList());
  });

  describe('ALERT_SHOW', () => {
    it('imports the alert', () => {
      const action = {
        type: ALERT_SHOW,
        title: 'alert_title',
        message: 'this is an alert message',
      };

      const expected = [{
        key: 0,
        message: 'this is an alert message',
        title: 'alert_title',
      }];

      const result = reducer(undefined, action);
      expect(ImmutableRecord.isRecord(result.get(0))).toBe(true);
      expect(result.toJS()).toMatchObject(expected);
    });
  });

  describe('ALERT_CLEAR', () => {
    it('deletes the alerts', () => {
      const actions = [{
        type: ALERT_SHOW,
        title: 'Oops!',
        message: 'Server is down',
      }, {
        type: ALERT_SHOW,
        title: 'Uh-oh!',
        message: 'Shit done fucked up',
      }, {
        type: ALERT_CLEAR,
      }];

      const result = applyActions(undefined, actions, reducer);
      expect(result.isEmpty()).toBe(true);
    });
  });

  describe('ALERT_DISMISS', () => {
    it('deletes an individual alert', () => {
      const actions = [{
        type: ALERT_SHOW,
        title: 'Oops!',
        message: 'Server is down',
      }, {
        type: ALERT_SHOW,
        title: 'Uh-oh!',
        message: 'Shit done fucked up',
      }, {
        type: ALERT_DISMISS,
        alert: {
          key: 0,
        },
      }];

      const result = applyActions(undefined, actions, reducer);
      expect(result.size).toEqual(1);
      expect(result.get(0).key).toEqual(1);
    });
  });
});

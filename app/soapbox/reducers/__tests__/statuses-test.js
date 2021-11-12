import reducer from '../statuses';
import { Map as ImmutableMap, fromJS } from 'immutable';
import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_FAIL,
} from 'soapbox/actions/statuses';


describe('statuses reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  describe('STATUS_CREATE_REQUEST', () => {
    it('increments the replies_count of its parent', () => {
      const state = fromJS({ '123': { replies_count: 4 } });

      const action = {
        type: STATUS_CREATE_REQUEST,
        params: { in_reply_to_id: '123' },
      };

      const result = reducer(state, action).getIn(['123', 'replies_count']);
      expect(result).toEqual(5);
    });
  });

  describe('STATUS_CREATE_FAIL', () => {
    it('decrements the replies_count of its parent', () => {
      const state = fromJS({ '123': { replies_count: 5 } });

      const action = {
        type: STATUS_CREATE_FAIL,
        params: { in_reply_to_id: '123' },
      };

      const result = reducer(state, action).getIn(['123', 'replies_count']);
      expect(result).toEqual(4);
    });
  });
});

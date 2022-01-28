import { Map as ImmutableMap, fromJS } from 'immutable';

import { STATUS_IMPORT } from 'soapbox/actions/importer';
import { normalizeStatus } from 'soapbox/actions/importer/normalizer';
import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_FAIL,
} from 'soapbox/actions/statuses';

import reducer from '../statuses';

describe('statuses reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  describe('STATUS_IMPORT', () => {
    it('fixes the order of mentions', () => {
      const status = require('soapbox/__fixtures__/status-unordered-mentions.json');
      const action = { type: STATUS_IMPORT, status };

      const expected = ['NEETzsche', 'alex', 'Lumeinshin', 'sneeden'];

      const result = reducer(undefined, action)
        .getIn(['AFChectaqZjmOVkXZ2', 'mentions'])
        .map(mention => mention.get('username'))
        .toJS();

      expect(result).toEqual(expected);
    });

    it('preserves the quote', () => {
      const quotePost = require('soapbox/__fixtures__/pleroma-quote-post.json');
      const quotedQuotePost = require('soapbox/__fixtures__/pleroma-quote-of-quote-post.json');

      let state = undefined;
      state = reducer(state, { type: STATUS_IMPORT, status: normalizeStatus(quotePost) });
      state = reducer(state, { type: STATUS_IMPORT, status: normalizeStatus(quotedQuotePost.pleroma.quote) });

      expect(state.getIn(['AFmFMSpITT9xcOJKcK', 'quote'])).toEqual('AFmFLcd6XYVdjWCrOS');
    });
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

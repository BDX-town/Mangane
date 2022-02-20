import { Map as ImmutableMap, fromJS } from 'immutable';

import { STATUS_IMPORT } from 'soapbox/actions/importer';
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
      state = reducer(state, { type: STATUS_IMPORT, status: quotePost });
      state = reducer(state, { type: STATUS_IMPORT, status: quotedQuotePost.pleroma.quote });

      expect(state.getIn(['AFmFMSpITT9xcOJKcK', 'quote'])).toEqual('AFmFLcd6XYVdjWCrOS');
    });

    it('normalizes Mitra attachments', () => {
      const status = require('soapbox/__fixtures__/mitra-status-with-attachments.json');

      const state = reducer(undefined, { type: STATUS_IMPORT, status });

      const expected = fromJS([{
        id: '017eeb0e-e5df-30a4-77a7-a929145cb836',
        type: 'image',
        url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
        preview_url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
        remote_url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
      }, {
        id: '017eeb0e-e5e4-2a48-2889-afdebf368a54',
        type: 'unknown',
        url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
        preview_url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
        remote_url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
      }, {
        id: '017eeb0e-e5e5-79fd-6054-8b6869b1db49',
        type: 'unknown',
        url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
        preview_url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
        remote_url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
      }, {
        id: '017eeb0e-e5e6-c416-a444-21e560c47839',
        type: 'unknown',
        url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
        preview_url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
        remote_url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
      }]);

      expect(state.getIn(['017eeb0e-e5e7-98fe-6b2b-ad02349251fb', 'media_attachments'])).toEqual(expected);
    });

    it('leaves Pleroma attachments alone', () => {
      const status = require('soapbox/__fixtures__/pleroma-status-with-attachments.json');
      const action = { type: STATUS_IMPORT, status };
      const state = reducer(undefined, action);
      const expected = fromJS(status.media_attachments);

      expect(state.getIn(['AGNkA21auFR5lnEAHw', 'media_attachments'])).toEqual(expected);
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

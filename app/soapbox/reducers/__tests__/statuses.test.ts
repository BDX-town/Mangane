import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable';

import { STATUS_IMPORT } from 'soapbox/actions/importer';
import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_FAIL,
  STATUS_DELETE_REQUEST,
  STATUS_DELETE_FAIL,
} from 'soapbox/actions/statuses';
import { normalizeStatus } from 'soapbox/normalizers';

import reducer, { ReducerStatus } from '../statuses';

describe('statuses reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(ImmutableMap());
  });

  describe('STATUS_IMPORT', () => {
    it('parses the status as a Record', () => {
      const status = require('soapbox/__fixtures__/pleroma-quote-post.json');
      const action = { type: STATUS_IMPORT, status };
      const result = reducer(undefined, action).get('AFmFMSpITT9xcOJKcK');

      expect(ImmutableRecord.isRecord(result)).toBe(true);
    });

    it('fixes the order of mentions', () => {
      const status = require('soapbox/__fixtures__/status-unordered-mentions.json');
      const action = { type: STATUS_IMPORT, status };

      const expected = ['NEETzsche', 'alex', 'Lumeinshin', 'sneeden'];

      const result = reducer(undefined, action)
        .get('AFChectaqZjmOVkXZ2')?.mentions
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

      const expected = [{
        id: '017eeb0e-e5df-30a4-77a7-a929145cb836',
        type: 'image',
        url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
        preview_url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
        remote_url: null,
      }, {
        id: '017eeb0e-e5e4-2a48-2889-afdebf368a54',
        type: 'unknown',
        url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
        preview_url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
        remote_url: null,
      }, {
        id: '017eeb0e-e5e5-79fd-6054-8b6869b1db49',
        type: 'unknown',
        url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
        preview_url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
        remote_url: null,
      }, {
        id: '017eeb0e-e5e6-c416-a444-21e560c47839',
        type: 'unknown',
        url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
        preview_url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
        remote_url: null,
      }];

      expect(state.get('017eeb0e-e5e7-98fe-6b2b-ad02349251fb')?.media_attachments.toJS()).toMatchObject(expected);
    });

    it('fixes Pleroma attachments', () => {
      const status = require('soapbox/__fixtures__/pleroma-status-with-attachments.json');
      const action = { type: STATUS_IMPORT, status };
      const state = reducer(undefined, action);
      const result = state.get('AGNkA21auFR5lnEAHw')?.media_attachments;

      expect(result?.size).toBe(4);
      expect(result?.get(1)?.meta).toEqual(ImmutableMap());
      expect(result?.getIn([1, 'pleroma', 'mime_type'])).toBe('application/x-nes-rom');
    });

    it('hides CWs', () => {
      const status = require('soapbox/__fixtures__/status-cw.json');
      const action = { type: STATUS_IMPORT, status };

      const hidden = reducer(undefined, action).getIn(['107831528995252317', 'hidden']);
      expect(hidden).toBe(true);
    });

    it('expands CWs when expandSpoilers is enabled', () => {
      const status = require('soapbox/__fixtures__/status-cw.json');
      const action = { type: STATUS_IMPORT, status, expandSpoilers: true };

      const hidden = reducer(undefined, action).getIn(['107831528995252317', 'hidden']);
      expect(hidden).toBe(false);
    });

    it('parses custom emojis', () => {
      const status = require('soapbox/__fixtures__/status-custom-emoji.json');
      const action = { type: STATUS_IMPORT, status };

      const expected = 'Hello <img draggable="false" class="emojione" alt=":ablobcathyper:" title=":ablobcathyper:" src="https://gleasonator.com/emoji/blobcat/ablobcathyper.png"> <img draggable="false" class="emojione" alt=":ageblobcat:" title=":ageblobcat:" src="https://gleasonator.com/emoji/blobcat/ageblobcat.png"> <img draggable="false" class="emojione" alt="😂" title=":joy:" src="/packs/emoji/1f602.svg"> world <img draggable="false" class="emojione" alt="😋" title=":yum:" src="/packs/emoji/1f60b.svg"> test <img draggable="false" class="emojione" alt=":blobcatphoto:" title=":blobcatphoto:" src="https://gleasonator.com/emoji/blobcat/blobcatphoto.png">';

      const result = reducer(undefined, action).getIn(['AGm7uC9DaAIGUa4KYK', 'contentHtml']);
      expect(result).toBe(expected);
    });

    it('builds search_index', () => {
      const status = require('soapbox/__fixtures__/status-with-poll.json');
      const action = { type: STATUS_IMPORT, status };

      const expected = `What is tolerance?

Banning, censoring, and deplatforming anyone you disagree with

Promoting free speech, even for people and ideas you dislike`;

      const result = reducer(undefined, action).getIn(['103874034847713213', 'search_index']);
      expect(result).toEqual(expected);
    });

    it('builds search_index with mentions', () => {
      const status = require('soapbox/__fixtures__/pleroma-status-reply-with-mentions.json');
      const action = { type: STATUS_IMPORT, status };

      const expected = `DMs are definitely only federated to the servers of the recipients tho. So if I DM a kfcc user, the kfcc admins can see it, but no other instance admins can.

@crunklord420@kiwifarms.cc

@becassine@kiwifarms.cc

@King_Porgi@poa.st

@ademan@thebag.social`;

      const result = reducer(undefined, action).getIn(['AHcweewcCh0iPUtMdk', 'search_index']);
      expect(result).toEqual(expected);
    });
  });

  describe('STATUS_CREATE_REQUEST', () => {
    it('increments the replies_count of its parent', () => {
      const state = ImmutableMap({
        '123': normalizeStatus({ replies_count: 4 }) as ReducerStatus,
      });

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
      const state = ImmutableMap({
        '123': normalizeStatus({ replies_count: 5 }) as ReducerStatus,
      });

      const action = {
        type: STATUS_CREATE_FAIL,
        params: { in_reply_to_id: '123' },
      };

      const result = reducer(state, action).getIn(['123', 'replies_count']);
      expect(result).toEqual(4);
    });
  });

  describe('STATUS_DELETE_REQUEST', () => {
    it('decrements the replies_count of its parent', () => {
      const state = ImmutableMap({
        '123': normalizeStatus({ replies_count: 4 }) as ReducerStatus,
      });

      const action = {
        type: STATUS_DELETE_REQUEST,
        params: { in_reply_to_id: '123' },
      };

      const result = reducer(state, action).getIn(['123', 'replies_count']);
      expect(result).toEqual(3);
    });

    it('gracefully does nothing if no parent', () => {
      const state = ImmutableMap({
        '123': normalizeStatus({ replies_count: 4 }) as ReducerStatus,
      });

      const action = {
        type: STATUS_DELETE_REQUEST,
        params: { id: '1' },
      };

      const result = reducer(state, action).getIn(['123', 'replies_count']);
      expect(result).toEqual(4);
    });
  });

  describe('STATUS_DELETE_FAIL', () => {
    it('decrements the replies_count of its parent', () => {
      const state = ImmutableMap({
        '123': normalizeStatus({ replies_count: 4 }) as ReducerStatus,
      });

      const action = {
        type: STATUS_DELETE_FAIL,
        params: { in_reply_to_id: '123' },
      };

      const result = reducer(state, action).getIn(['123', 'replies_count']);
      expect(result).toEqual(5);
    });

    it('gracefully does nothing if no parent', () => {
      const state = ImmutableMap({
        '123': normalizeStatus({ replies_count: 4 }) as ReducerStatus,
      });

      const action = {
        type: STATUS_DELETE_FAIL,
        params: { id: '1' },
      };

      const result = reducer(state, action).getIn(['123', 'replies_count']);
      expect(result).toEqual(4);
    });
  });
});

import { List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';

import * as actions from 'soapbox/actions/compose';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { SETTING_CHANGE } from 'soapbox/actions/settings';
import { TIMELINE_DELETE } from 'soapbox/actions/timelines';
import { TagRecord } from 'soapbox/normalizers';
import { normalizeStatus } from 'soapbox/normalizers/status';

import reducer, { ReducerRecord } from '../compose';

describe('compose reducer', () => {
  it('returns the initial state by default', () => {
    const state = reducer(undefined, {} as any);
    expect(state.toJS()).toMatchObject({
      mounted: 0,
      sensitive: false,
      spoiler: false,
      spoiler_text: '',
      privacy: 'public',
      text: '',
      focusDate: null,
      caretPosition: null,
      in_reply_to: null,
      is_composing: false,
      is_submitting: false,
      is_changing_upload: false,
      is_uploading: false,
      progress: 0,
      media_attachments: [],
      poll: null,
      suggestion_token: null,
      suggestions: [],
      default_privacy: 'public',
      default_sensitive: false,
      tagHistory: [],
      content_type: 'text/plain',
    });
    expect(state.get('idempotencyKey').length === 36);
  });

  describe('COMPOSE_SET_STATUS', () => {
    it('strips Pleroma integer attachments', () => {
      const action = {
        type: actions.COMPOSE_SET_STATUS,
        status: normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json'))),
        v: { software: 'Pleroma' },
        withRedraft: true,
      };

      const result = reducer(undefined, action);
      expect(result.get('media_attachments').isEmpty()).toBe(true);
    });

    it('leaves non-Pleroma integer attachments alone', () => {
      const action = {
        type: actions.COMPOSE_SET_STATUS,
        status: normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json'))),
      };

      const result = reducer(undefined, action);
      expect(result.getIn(['media_attachments', 0, 'id'])).toEqual('508107650');
    });

    it('sets the id when editing a post', () => {
      const action = {
        withRedraft: false,
        type: actions.COMPOSE_SET_STATUS,
        status: normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json'))),
      };

      const result = reducer(undefined, action);
      expect(result.get('id')).toEqual('AHU2RrX0wdcwzCYjFQ');
    });

    it('does not set the id when redrafting a post', () => {
      const action = {
        withRedraft: true,
        type: actions.COMPOSE_SET_STATUS,
        status: normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json'))),
      };

      const result = reducer(undefined, action);
      expect(result.get('id')).toEqual(null);
    });
  });

  it('uses \'public\' scope as default', () => {
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableRecord({})(),
      account: ImmutableRecord({})(),
    };
    expect(reducer(undefined, action).toJS()).toMatchObject({ privacy: 'public' });
  });

  it('uses \'direct\' scope when replying to a DM', () => {
    const state = ReducerRecord({ default_privacy: 'public' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableRecord({ visibility: 'direct' })(),
      account: ImmutableRecord({})(),
    };
    expect(reducer(state as any, action).toJS()).toMatchObject({ privacy: 'direct' });
  });

  it('uses \'private\' scope when replying to a private post', () => {
    const state = ReducerRecord({ default_privacy: 'public' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableRecord({ visibility: 'private' })(),
      account: ImmutableRecord({})(),
    };
    expect(reducer(state as any, action).toJS()).toMatchObject({ privacy: 'private' });
  });

  it('uses \'unlisted\' scope when replying to an unlisted post', () => {
    const state = ReducerRecord({ default_privacy: 'public' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableRecord({ visibility: 'unlisted' })(),
      account: ImmutableRecord({})(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'unlisted' });
  });

  it('uses \'private\' scope when set as preference and replying to a public post', () => {
    const state = ReducerRecord({ default_privacy: 'private' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableRecord({ visibility: 'public' })(),
      account: ImmutableRecord({})(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'private' });
  });

  it('uses \'unlisted\' scope when set as preference and replying to a public post', () => {
    const state = ReducerRecord({ default_privacy: 'unlisted' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableRecord({ visibility: 'public' })(),
      account: ImmutableRecord({})(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'unlisted' });
  });

  it('sets preferred scope on user login', () => {
    const state = ReducerRecord({ default_privacy: 'public' });
    const action = {
      type: ME_FETCH_SUCCESS,
      me: { pleroma: { settings_store: { soapbox_fe: { defaultPrivacy: 'unlisted' } } } },
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      default_privacy: 'unlisted',
      privacy: 'unlisted',
    });
  });

  it('sets preferred scope on settings change', () => {
    const state = ReducerRecord({ default_privacy: 'public' });
    const action = {
      type: SETTING_CHANGE,
      path: ['defaultPrivacy'],
      value: 'unlisted',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      default_privacy: 'unlisted',
      privacy: 'unlisted',
    });
  });

  it('sets default scope on settings save (but retains current scope)', () => {
    const state = ReducerRecord({ default_privacy: 'public', privacy: 'public' });
    const action = {
      type: ME_PATCH_SUCCESS,
      me: { pleroma: { settings_store: { soapbox_fe: { defaultPrivacy: 'unlisted' } } } },
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      default_privacy: 'unlisted',
      privacy: 'public',
    });
  });

  it('should handle COMPOSE_MOUNT', () => {
    const state = ReducerRecord({ mounted: 1 });
    const action = {
      type: actions.COMPOSE_MOUNT,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      mounted: 2,
    });
  });

  it('should handle COMPOSE_UNMOUNT', () => {
    const state = ReducerRecord({ mounted: 1 });
    const action = {
      type: actions.COMPOSE_UNMOUNT,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      mounted: 0,
    });
  });

  it('should handle COMPOSE_SENSITIVITY_CHANGE on Mark Sensitive click, don\'t toggle if spoiler active', () => {
    const state = ReducerRecord({ spoiler: true, sensitive: true, idempotencyKey: '' });
    const action = {
      type: actions.COMPOSE_SENSITIVITY_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      sensitive: true,
    });
  });

  it('should handle COMPOSE_SENSITIVITY_CHANGE on Mark Sensitive click, toggle if spoiler inactive', () => {
    const state = ReducerRecord({ spoiler: false, sensitive: true });
    const action = {
      type: actions.COMPOSE_SENSITIVITY_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      sensitive: false,
    });
  });

  it('should handle COMPOSE_SPOILERNESS_CHANGE on CW button click', () => {
    const state = ReducerRecord({ spoiler_text: 'spoiler text', spoiler: true, media_attachments: ImmutableList() });
    const action = {
      type: actions.COMPOSE_SPOILERNESS_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      spoiler: false,
      spoiler_text: '',
    });
  });

  it('should handle COMPOSE_SPOILER_TEXT_CHANGE', () => {
    const state = ReducerRecord({ spoiler_text: 'prevtext' });
    const action = {
      type: actions.COMPOSE_SPOILER_TEXT_CHANGE,
      text: 'nexttext',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      spoiler_text: 'nexttext',
    });
  });

  it('should handle COMPOSE_VISIBILITY_CHANGE', () => {
    const state = ReducerRecord({ privacy: 'public' });
    const action = {
      type: actions.COMPOSE_VISIBILITY_CHANGE,
      value: 'direct',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      privacy: 'direct',
    });
  });

  describe('COMPOSE_CHANGE', () => {
    it('should handle text changing', () => {
      const state = ReducerRecord({ text: 'prevtext' });
      const action = {
        type: actions.COMPOSE_CHANGE,
        text: 'nexttext',
      };
      expect(reducer(state, action).toJS()).toMatchObject({
        text: 'nexttext',
      });
    });
  });

  it('should handle COMPOSE_COMPOSING_CHANGE', () => {
    const state = ReducerRecord({ is_composing: true });
    const action = {
      type: actions.COMPOSE_COMPOSING_CHANGE,
      value: false,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_composing: false,
    });
  });

  it('should handle COMPOSE_SUBMIT_REQUEST', () => {
    const state = ReducerRecord({ is_submitting: false });
    const action = {
      type: actions.COMPOSE_SUBMIT_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_submitting: true,
    });
  });

  it('should handle COMPOSE_UPLOAD_CHANGE_REQUEST', () => {
    const state = ReducerRecord({ is_changing_upload: false });
    const action = {
      type: actions.COMPOSE_UPLOAD_CHANGE_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_changing_upload: true,
    });
  });

  it('should handle COMPOSE_SUBMIT_SUCCESS', () => {
    const state = ReducerRecord({ default_privacy: 'public', privacy: 'private' });
    const action = {
      type: actions.COMPOSE_SUBMIT_SUCCESS,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      privacy: 'public',
    });
  });

  it('should handle COMPOSE_SUBMIT_FAIL', () => {
    const state = ReducerRecord({ is_submitting: true });
    const action = {
      type: actions.COMPOSE_SUBMIT_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_submitting: false,
    });
  });

  it('should handle COMPOSE_UPLOAD_CHANGE_FAIL', () => {
    const state = ReducerRecord({ is_changing_upload: true });
    const action = {
      type: actions.COMPOSE_UPLOAD_CHANGE_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_changing_upload: false,
    });
  });

  it('should handle COMPOSE_UPLOAD_REQUEST', () => {
    const state = ReducerRecord({ is_uploading: false });
    const action = {
      type: actions.COMPOSE_UPLOAD_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_uploading: true,
    });
  });

  it('should handle COMPOSE_UPLOAD_SUCCESS', () => {
    const state = ReducerRecord({ media_attachments: ImmutableList() });
    const media = [
      {
        description: null,
        id: '1375732379',
        pleroma: {
          mime_type: 'image/jpeg',
        },
        preview_url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg',
        remote_url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg',
        text_url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg',
        type: 'image',
        url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg',
      },
    ];
    const action = {
      type: actions.COMPOSE_UPLOAD_SUCCESS,
      media: media,
      skipLoading: true,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_uploading: false,
    });
  });

  it('should handle COMPOSE_UPLOAD_FAIL', () => {
    const state = ReducerRecord({ is_uploading: true });
    const action = {
      type: actions.COMPOSE_UPLOAD_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_uploading: false,
    });
  });

  it('should handle COMPOSE_UPLOAD_PROGRESS', () => {
    const state = ReducerRecord({ progress: 0 });
    const action = {
      type: actions.COMPOSE_UPLOAD_PROGRESS,
      loaded: 10,
      total: 15,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      progress: 67,
    });
  });

  it('should handle COMPOSE_SUGGESTIONS_CLEAR', () => {
    const action = {
      type: actions.COMPOSE_SUGGESTIONS_CLEAR,
      suggestions: [],
      suggestion_token: 'aiekdns3',
    };
    expect(reducer(undefined, action).toJS()).toMatchObject({
      suggestion_token: null,
    });
  });

  it('should handle COMPOSE_SUGGESTION_TAGS_UPDATE', () => {
    const state = ReducerRecord({ tagHistory: ImmutableList([ 'hashtag' ]) });
    const action = {
      type: actions.COMPOSE_SUGGESTION_TAGS_UPDATE,
      token: 'aaadken3',
      currentTrends: ImmutableList([
        TagRecord({ name: 'hashtag' }),
      ]),
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      suggestion_token: 'aaadken3',
      suggestions: [],
      tagHistory: [ 'hashtag' ],
    });
  });

  it('should handle COMPOSE_TAG_HISTORY_UPDATE', () => {
    const action = {
      type: actions.COMPOSE_TAG_HISTORY_UPDATE,
      tags: [ 'hashtag', 'hashtag2'],
    };
    expect(reducer(undefined, action).toJS()).toMatchObject({
      tagHistory: [ 'hashtag', 'hashtag2' ],
    });
  });

  it('should handle TIMELINE_DELETE - delete status from timeline', () => {
    const state = ReducerRecord({ in_reply_to: '9wk6pmImMrZjgrK7iC' });
    const action = {
      type: TIMELINE_DELETE,
      id: '9wk6pmImMrZjgrK7iC',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      in_reply_to: null,
    });
  });

  it('should handle COMPOSE_POLL_ADD', () => {
    const state = ReducerRecord({ poll: null });
    const initialPoll = Object({
      options: [
        '',
        '',
      ],
      expires_in: 86400,
      multiple: false,
    });
    const action = {
      type: actions.COMPOSE_POLL_ADD,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      poll: initialPoll,
    });
  });

  it('should handle COMPOSE_POLL_REMOVE', () => {
    const action = {
      type: actions.COMPOSE_POLL_REMOVE,
    };
    expect(reducer(undefined, action).toJS()).toMatchObject({
      poll: null,
    });
  });

  it('should handle COMPOSE_POLL_OPTION_CHANGE', () => {
    const initialPoll = Object({
      options: [
        'option 1',
        'option 2',
      ],
      expires_in: 86400,
      multiple: false,
    });
    const state = ReducerRecord({ poll: initialPoll });
    const action = {
      type: actions.COMPOSE_POLL_OPTION_CHANGE,
      index: 0,
      title: 'change option',
    };
    const updatedPoll = Object({
      options: [
        'change option',
        'option 2',
      ],
      expires_in: 86400,
      multiple: false,
    });
    expect(reducer(state, action).toJS()).toMatchObject({
      poll: updatedPoll,
    });
  });

  it('sets the post content-type', () => {
    const action = {
      type: actions.COMPOSE_TYPE_CHANGE,
      value: 'text/plain',
    };
    expect(reducer(undefined, action).toJS()).toMatchObject({ content_type: 'text/plain' });
  });
});

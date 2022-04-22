import { Map as ImmutableMap, fromJS } from 'immutable';

import * as actions from 'soapbox/actions/compose';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { SETTING_CHANGE } from 'soapbox/actions/settings';
import { REDRAFT } from 'soapbox/actions/statuses';
import { TIMELINE_DELETE } from 'soapbox/actions/timelines';
import { normalizeStatus } from 'soapbox/normalizers/status';

import reducer from '../compose';

describe('compose reducer', () => {
  it('returns the initial state by default', () => {
    const state = reducer(undefined, {});
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

  describe('REDRAFT', () => {
    it('strips Pleroma integer attachments', () => {
      const action = {
        type: REDRAFT,
        status: normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json'))),
        v: { software: 'Pleroma' },
      };

      const result = reducer(undefined, action);
      expect(result.get('media_attachments').isEmpty()).toBe(true);
    });

    it('leaves non-Pleroma integer attachments alone', () => {
      const action = {
        type: REDRAFT,
        status: normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json'))),
      };

      const result = reducer(undefined, action);
      expect(result.getIn(['media_attachments', 0, 'id'])).toEqual('508107650');
    });
  });

  it('uses \'public\' scope as default', () => {
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableMap(),
      account: ImmutableMap(),
    };
    expect(reducer(undefined, action).toJS()).toMatchObject({ privacy: 'public' });
  });

  it('uses \'direct\' scope when replying to a DM', () => {
    const state = ImmutableMap({ default_privacy: 'public' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'direct' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'direct' });
  });

  it('uses \'private\' scope when replying to a private post', () => {
    const state = ImmutableMap({ default_privacy: 'public' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'private' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'private' });
  });

  it('uses \'unlisted\' scope when replying to an unlisted post', () => {
    const state = ImmutableMap({ default_privacy: 'public' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'unlisted' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'unlisted' });
  });

  it('uses \'private\' scope when set as preference and replying to a public post', () => {
    const state = ImmutableMap({ default_privacy: 'private' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'public' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'private' });
  });

  it('uses \'unlisted\' scope when set as preference and replying to a public post', () => {
    const state = ImmutableMap({ default_privacy: 'unlisted' });
    const action = {
      type: actions.COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'public' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'unlisted' });
  });

  it('sets preferred scope on user login', () => {
    const state = ImmutableMap({ default_privacy: 'public' });
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
    const state = ImmutableMap({ default_privacy: 'public' });
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
    const state = ImmutableMap({ default_privacy: 'public', privacy: 'public' });
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
    const state = ImmutableMap({ mounted: 1 });
    const action = {
      type: actions.COMPOSE_MOUNT,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      mounted: 2,
    });
  });

  it('should handle COMPOSE_UNMOUNT', () => {
    const state = ImmutableMap({ mounted: 1 });
    const action = {
      type: actions.COMPOSE_UNMOUNT,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      mounted: 0,
    });
  });

  it('should handle COMPOSE_SENSITIVITY_CHANGE on Mark Sensitive click, don\'t toggle if spoiler active', () => {
    const state = ImmutableMap({ spoiler: true, sensitive: true, idempotencyKey: null });
    const action = {
      type: actions.COMPOSE_SENSITIVITY_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      sensitive: true,
    });
  });

  it('should handle COMPOSE_SENSITIVITY_CHANGE on Mark Sensitive click, toggle if spoiler inactive', () => {
    const state = ImmutableMap({ spoiler: false, sensitive: true });
    const action = {
      type: actions.COMPOSE_SENSITIVITY_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      sensitive: false,
    });
  });

  it('should handle COMPOSE_SPOILERNESS_CHANGE on CW button click', () => {
    const state = ImmutableMap({ spoiler_text: 'spoiler text', spoiler: true, media_attachments: { } });
    const action = {
      type: actions.COMPOSE_SPOILERNESS_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      spoiler: false,
      spoiler_text: '',
    });
  });

  it('should handle COMPOSE_SPOILER_TEXT_CHANGE', () => {
    const state = ImmutableMap({ spoiler_text: 'prevtext' });
    const action = {
      type: actions.COMPOSE_SPOILER_TEXT_CHANGE,
      text: 'nexttext',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      spoiler_text: 'nexttext',
    });
  });

  it('should handle COMPOSE_VISIBILITY_CHANGE', () => {
    const state = ImmutableMap({ privacy: 'public' });
    const action = {
      type: actions.COMPOSE_VISIBILITY_CHANGE,
      value: 'direct',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      privacy: 'direct',
    });
  });

  it('should handle COMPOSE_CHANGE', () => {
    const state = ImmutableMap({ text: 'prevtext' });
    const action = {
      type: actions.COMPOSE_CHANGE,
      text: 'nexttext',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      text: 'nexttext',
    });
  });

  it('should handle COMPOSE_COMPOSING_CHANGE', () => {
    const state = ImmutableMap({ is_composing: true });
    const action = {
      type: actions.COMPOSE_COMPOSING_CHANGE,
      value: false,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_composing: false,
    });
  });

  it('should handle COMPOSE_SUBMIT_REQUEST', () => {
    const state = ImmutableMap({ is_submitting: false });
    const action = {
      type: actions.COMPOSE_SUBMIT_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_submitting: true,
    });
  });

  it('should handle COMPOSE_UPLOAD_CHANGE_REQUEST', () => {
    const state = ImmutableMap({ is_changing_upload: false });
    const action = {
      type: actions.COMPOSE_UPLOAD_CHANGE_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_changing_upload: true,
    });
  });

  it('should handle COMPOSE_SUBMIT_SUCCESS', () => {
    const state = ImmutableMap({ privacy: 'public' });
    const action = {
      type: actions.COMPOSE_SUBMIT_SUCCESS,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      privacy: undefined,
    });
  });

  it('should handle COMPOSE_SUBMIT_FAIL', () => {
    const state = ImmutableMap({ is_submitting: true });
    const action = {
      type: actions.COMPOSE_SUBMIT_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_submitting: false,
    });
  });

  it('should handle COMPOSE_UPLOAD_CHANGE_FAIL', () => {
    const state = ImmutableMap({ is_changing_upload: true });
    const action = {
      type: actions.COMPOSE_UPLOAD_CHANGE_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_changing_upload: false,
    });
  });

  it('should handle COMPOSE_UPLOAD_REQUEST', () => {
    const state = ImmutableMap({ is_uploading: false });
    const action = {
      type: actions.COMPOSE_UPLOAD_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_uploading: true,
    });
  });

  it('should handle COMPOSE_UPLOAD_SUCCESS', () => {
    const state = ImmutableMap({ media_attachments: [] });
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
    const state = ImmutableMap({ is_uploading: true });
    const action = {
      type: actions.COMPOSE_UPLOAD_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_uploading: false,
    });
  });

  it('should handle COMPOSE_UPLOAD_PROGRESS', () => {
    const state = ImmutableMap({ progress: 0 });
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
    const state = ImmutableMap({ });
    const action = {
      type: actions.COMPOSE_SUGGESTIONS_CLEAR,
      suggestions: [],
      suggestion_token: 'aiekdns3',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      suggestion_token: null,
    });
  });

  it('should handle COMPOSE_SUGGESTION_TAGS_UPDATE', () => {
    const state = ImmutableMap({ tagHistory: [ 'hashtag' ] });
    const action = {
      type: actions.COMPOSE_SUGGESTION_TAGS_UPDATE,
      token: 'aaadken3',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      suggestion_token: 'aaadken3',
      suggestions: [],
      tagHistory: [ 'hashtag' ],
    });
  });

  it('should handle COMPOSE_TAG_HISTORY_UPDATE', () => {
    const state = ImmutableMap({ });
    const action = {
      type: actions.COMPOSE_TAG_HISTORY_UPDATE,
      tags: [ 'hashtag', 'hashtag2'],
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      tagHistory: [ 'hashtag', 'hashtag2' ],
    });
  });

  it('should handle TIMELINE_DELETE - delete status from timeline', () => {
    const state = ImmutableMap({ in_reply_to: '9wk6pmImMrZjgrK7iC' });
    const action = {
      type: TIMELINE_DELETE,
      id: '9wk6pmImMrZjgrK7iC',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      in_reply_to: null,
    });
  });

  it('should handle COMPOSE_POLL_ADD', () => {
    const state = ImmutableMap({ poll: null });
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
    const state = ImmutableMap({ });
    const action = {
      type: actions.COMPOSE_POLL_REMOVE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
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
    const state = ImmutableMap({ poll: initialPoll });
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

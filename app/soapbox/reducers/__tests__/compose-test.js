import reducer from '../compose';
import { Map as ImmutableMap } from 'immutable';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { SETTING_CHANGE } from 'soapbox/actions/settings';
import * as actions from 'soapbox/actions/compose';
//import { STORE_HYDRATE } from 'soapbox/actions/store';
//import { REDRAFT } from 'soapbox/actions/statuses';
//import { TIMELINE_DELETE } from 'soapbox/actions/timelines';

describe('compose reducer', () => {
  it('returns the initial state by default', () => {
    expect(reducer(undefined, {}).toJS()).toMatchObject({
      mounted: 0,
      sensitive: false,
      spoiler: false,
      spoiler_text: '',
      privacy: null,
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
      idempotencyKey: null,
      tagHistory: [],
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

  // it('should handle STORE_HYDRATE', () => {
  //   const state = ImmutableMap({ compose: 'public' });
  //   const action = {
  //     type: STORE_HYDRATE,
  //   };
  //   expect(reducer.hydrate(state, action.toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
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
    const state = ImmutableMap({ mounted: 1});
    const action = {
      type: actions.COMPOSE_UNMOUNT,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      mounted: 0,
    });
  });

  it('should handle COMPOSE_SENSITIVITY_CHANGE on Mark Sensitive click, don\'t toggle if spoiler active', () => {
    const state = ImmutableMap({ spoiler: true, sensitive: true});
    const action = {
      type: actions.COMPOSE_SENSITIVITY_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      sensitive: true,
    });
  });

  it('should handle COMPOSE_SENSITIVITY_CHANGE on Mark Sensitive click, toggle if spoiler inactive', () => {
    const state = ImmutableMap({ spoiler: false, sensitive: true});
    const action = {
      type: actions.COMPOSE_SENSITIVITY_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      sensitive: false,
    });
  });

  // it('should handle COMPOSE_SPOILERNESS_CHANGE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SPOILERNESS_CHANGE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SPOILER_TEXT_CHANGE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SPOILER_TEXT_CHANGE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_VISIBILITY_CHANGE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_VISIBILITY_CHANGE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_CHANGE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_CHANGE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_COMPOSING_CHANGE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_COMPOSING_CHANGE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SUBMIT_REQUEST', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SUBMIT_REQUEST,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_CHANGE_REQUEST', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_CHANGE_REQUEST,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SUBMIT_SUCCESS', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SUBMIT_SUCCESS,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SUBMIT_FAIL', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SUBMIT_FAIL,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_CHANGE_FAIL', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_CHANGE_FAIL,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_REQUEST', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_REQUEST,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_SUCCESS', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_SUCCESS,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_FAIL', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_FAIL,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_UNDO', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_UNDO,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_PROGRESS', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_PROGRESS,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_MENTION', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_MENTION,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_DIRECT', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_DIRECT,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SUGGESTIONS_CLEAR', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SUGGESTIONS_CLEAR,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SUGGESTIONS_READY', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SUGGESTIONS_READY,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SUGGESTION_SELECT', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SUGGESTION_SELECT,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_SUGGESTION_TAGS_UPDATE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_SUGGESTION_TAGS_UPDATE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_TAG_HISTORY_UPDATE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_TAG_HISTORY_UPDATE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle TIMELINE_DELETE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: TIMELINE_DELETE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_EMOJI_INSERT', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_EMOJI_INSERT,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_UPLOAD_CHANGE_SUCCESS', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_CHANGE_SUCCESS,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle REDRAFT', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: REDRAFT,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_POLL_ADD', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_POLL_ADD,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_POLL_REMOVE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_POLL_REMOVE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_POLL_OPTION_ADD', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_POLL_OPTION_ADD,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_POLL_OPTION_CHANGE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_POLL_OPTION_CHANGE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_POLL_OPTION_REMOVE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_POLL_OPTION_REMOVE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
  //
  // it('should handle COMPOSE_POLL_SETTINGS_CHANGE', () => {
  //   const state = ImmutableMap({ default_privacy: 'public', privacy: 'public'});
  //   const action = {
  //     type: actions.COMPOSE_POLL_SETTINGS_CHANGE,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     default_privacy: 'unlisted',
  //     privacy: 'public',
  //   });
  // });
});

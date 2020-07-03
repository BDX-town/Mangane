import reducer from '../compose';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
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
    const state = ImmutableMap({ mounted: 1 });
    const action = {
      type: actions.COMPOSE_UNMOUNT,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      mounted: 0,
    });
  });

  //Remove this test once spoiler is decoupled from marking media as sensitive
  it('should handle COMPOSE_SENSITIVITY_CHANGE on Mark Sensitive click, don\'t toggle if spoiler active', () => {
    const state = ImmutableMap({ spoiler: true, sensitive: true, idempotencyKey: null });
    const action = {
      type: actions.COMPOSE_SENSITIVITY_CHANGE,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      sensitive: true,
    });
  });

  //Edit this test to not pass spoiler state once spoiler is decoupled from marking media as sensitive
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
      value: 'direct'
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

  // it('should handle COMPOSE_UPLOAD_SUCCESS and mark sensitive if default sensitive enabled', () => {
  //   const state = ImmutableMap({ media_attachments: { } });
  //   const media = null;
  //   const action = {
  //     type: actions.COMPOSE_UPLOAD_SUCCESS,
  //     media: media,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     is_uploading: false,
  //     sensitive: true,
  //   });
  // });

  it('should handle COMPOSE_UPLOAD_FAIL', () => {
    const state = ImmutableMap({ is_uploading: true });
    const action = {
      type: actions.COMPOSE_UPLOAD_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      is_uploading: false,
    });
  });

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

  // it('should handle COMPOSE_MENTION', () => {
  //   const state = ImmutableMap({ focusDate: null, caretPosition: 0 });
  //   const action = {
  //     type: actions.COMPOSE_MENTION,
  //     account: '@alex@gleasonator.com',
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     focusDate: 'unlisted',
  //     caretPosition: 12,
  //   });
  // });

  // it('should handle COMPOSE_DIRECT', () => {
  //   const state = ImmutableMap({ caretPosition: 0, privacy: 'public' });
  //   const action = {
  //     type: actions.COMPOSE_DIRECT,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     caretPosition: 12,
  //     privacy: 'direct',
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
  //   const state = ImmutableMap({ poll: null });
  //   const initialPoll = ImmutableMap({
  //     options: ImmutableList(['', '']),
  //     expires_in: 24 * 3600,
  //     multiple: false,
  //   });
  //   const action = {
  //     type: actions.COMPOSE_POLL_ADD,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     poll: initialPoll,
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

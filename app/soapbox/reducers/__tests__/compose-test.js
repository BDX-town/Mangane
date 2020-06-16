import reducer from '../compose';
import { Map as ImmutableMap } from 'immutable';
import { COMPOSE_REPLY } from 'soapbox/actions/compose';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { SETTING_CHANGE } from 'soapbox/actions/settings';

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
      type: COMPOSE_REPLY,
      status: ImmutableMap(),
      account: ImmutableMap(),
    };
    expect(reducer(undefined, action).toJS()).toMatchObject({ privacy: 'public' });
  });

  it('uses \'direct\' scope when replying to a DM', () => {
    const state = ImmutableMap({ default_privacy: 'public' });
    const action = {
      type: COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'direct' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'direct' });
  });

  it('uses \'private\' scope when replying to a private post', () => {
    const state = ImmutableMap({ default_privacy: 'public' });
    const action = {
      type: COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'private' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'private' });
  });

  it('uses \'unlisted\' scope when replying to an unlisted post', () => {
    const state = ImmutableMap({ default_privacy: 'public' });
    const action = {
      type: COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'unlisted' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'unlisted' });
  });

  it('uses \'private\' scope when set as preference and replying to a public post', () => {
    const state = ImmutableMap({ default_privacy: 'private' });
    const action = {
      type: COMPOSE_REPLY,
      status: ImmutableMap({ visibility: 'public' }),
      account: ImmutableMap(),
    };
    expect(reducer(state, action).toJS()).toMatchObject({ privacy: 'private' });
  });

  it('uses \'unlisted\' scope when set as preference and replying to a public post', () => {
    const state = ImmutableMap({ default_privacy: 'unlisted' });
    const action = {
      type: COMPOSE_REPLY,
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
});

import { debounce } from 'lodash';
import { showAlertForError } from './alerts';
import { patchMe } from 'soapbox/actions/me';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import uuid from '../uuid';

export const SETTING_CHANGE = 'SETTING_CHANGE';
export const SETTING_SAVE   = 'SETTING_SAVE';

export const FE_NAME = 'soapbox_fe';

export const defaultSettings = ImmutableMap({
  onboarded: false,

  skinTone: 1,
  reduceMotion: false,
  autoPlayGif: true,
  displayMedia: 'default',
  tagMisleadingLinks: true,
  expandSpoilers: false,
  unfollowModal: false,
  boostModal: false,
  deleteModal: true,
  defaultPrivacy: 'public',
  defaultContentType: 'text/plain',
  themeMode: 'light',
  locale: navigator.language.split(/[-_]/)[0] || 'en',
  explanationBox: true,
  otpEnabled: false,

  systemFont: false,
  dyslexicFont: false,
  demetricator: false,

  chats: ImmutableMap({
    panes: ImmutableList(),
    mainWindow: 'minimized',
    sound: true,
  }),

  home: ImmutableMap({
    shows: ImmutableMap({
      reblog: true,
      reply: true,
      direct: false,
    }),

    regex: ImmutableMap({
      body: '',
    }),
  }),

  notifications: ImmutableMap({
    alerts: ImmutableMap({
      follow: true,
      favourite: true,
      reblog: true,
      mention: true,
      poll: true,
      'pleroma:emoji_reaction': true,
    }),

    quickFilter: ImmutableMap({
      active: 'all',
      show: true,
      advanced: false,
    }),

    shows: ImmutableMap({
      follow: true,
      favourite: true,
      reblog: true,
      mention: true,
      poll: true,
      'pleroma:emoji_reaction': true,
    }),

    sounds: ImmutableMap({
      follow: false,
      favourite: false,
      reblog: false,
      mention: false,
      poll: false,
      'pleroma:emoji_reaction': false,
    }),
  }),

  community: ImmutableMap({
    shows: ImmutableMap({
      reblog: false,
      reply: true,
    }),
    other: ImmutableMap({
      onlyMedia: false,
    }),
    regex: ImmutableMap({
      body: '',
    }),
  }),

  public: ImmutableMap({
    shows: ImmutableMap({
      reblog: true,
      reply: true,
    }),
    other: ImmutableMap({
      onlyMedia: false,
    }),
    regex: ImmutableMap({
      body: '',
    }),
  }),

  direct: ImmutableMap({
    regex: ImmutableMap({
      body: '',
    }),
  }),

  trends: ImmutableMap({
    show: true,
  }),

  columns: ImmutableList([
    ImmutableMap({ id: 'COMPOSE', uuid: uuid(), params: {} }),
    ImmutableMap({ id: 'HOME', uuid: uuid(), params: {} }),
    ImmutableMap({ id: 'NOTIFICATIONS', uuid: uuid(), params: {} }),
  ]),
});

export function getSettings(state) {
  const soapboxSettings = state.getIn(['soapbox', 'defaultSettings']);
  return defaultSettings
    .mergeDeep(soapboxSettings)
    .mergeDeep(state.get('settings'));
}

export function changeSetting(path, value) {
  return dispatch => {
    dispatch({
      type: SETTING_CHANGE,
      path,
      value,
    });

    dispatch(saveSettings());
  };
};

const debouncedSave = debounce((dispatch, getState) => {
  const state = getState();
  if (!state.get('me')) return;
  if (getSettings(state).getIn(['saved'])) return;

  const data = state.get('settings').delete('saved').toJS();

  dispatch(patchMe({
    pleroma_settings_store: {
      [FE_NAME]: data,
    },
  })).then(response => {
    dispatch({ type: SETTING_SAVE });
  }).catch(error => {
    dispatch(showAlertForError(error));
  });
}, 5000, { trailing: true });

export function saveSettings() {
  return (dispatch, getState) => debouncedSave(dispatch, getState);
};

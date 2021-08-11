import { debounce } from 'lodash';
import { showAlertForError } from './alerts';
import { patchMe } from 'soapbox/actions/me';
import { Map as ImmutableMap, List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import { isLoggedIn } from 'soapbox/utils/auth';
import uuid from '../uuid';
import { createSelector } from 'reselect';

export const SETTING_CHANGE = 'SETTING_CHANGE';
export const SETTING_SAVE   = 'SETTING_SAVE';

export const FE_NAME = 'soapbox_fe';

export const defaultSettings = ImmutableMap({
  onboarded: false,

  skinTone: 1,
  reduceMotion: false,
  underlineLinks: false,
  autoPlayGif: true,
  displayMedia: 'default',
  expandSpoilers: false,
  unfollowModal: false,
  boostModal: false,
  deleteModal: true,
  missingDescriptionModal: false,
  defaultPrivacy: 'public',
  defaultContentType: 'text/plain',
  themeMode: 'light',
  locale: navigator.language.split(/[-_]/)[0] || 'en',
  showExplanationBox: true,
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
      follow_request: false,
      favourite: true,
      reblog: true,
      mention: true,
      poll: true,
      move: true,
      'pleroma:emoji_reaction': true,
    }),

    quickFilter: ImmutableMap({
      active: 'all',
      show: true,
      advanced: false,
    }),

    shows: ImmutableMap({
      follow: true,
      follow_request: false,
      favourite: true,
      reblog: true,
      mention: true,
      poll: true,
      move: true,
      'pleroma:emoji_reaction': true,
    }),

    sounds: ImmutableMap({
      follow: false,
      follow_request: false,
      favourite: false,
      reblog: false,
      mention: false,
      poll: false,
      move: false,
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

  account_timeline: ImmutableMap({
    shows: ImmutableMap({
      reblog: true,
      pinned: true,
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

  remote_timeline: ImmutableMap({
    pinnedHosts: ImmutableOrderedSet(),
  }),
});

export const getSettings = createSelector([
  state => state.getIn(['soapbox', 'defaultSettings']),
  state => state.get('settings'),
], (soapboxSettings, settings) => {
  return defaultSettings
    .mergeDeep(soapboxSettings)
    .mergeDeep(settings);
});

export function changeSetting(path, value) {
  return dispatch => {
    dispatch({
      type: SETTING_CHANGE,
      path,
      value,
    });

    dispatch(saveSettings());
  };
}

const debouncedSave = debounce((dispatch, getState) => {
  if (!isLoggedIn(getState)) return;

  const state = getState();
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
}

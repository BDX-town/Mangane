import { Map as ImmutableMap, List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import { defineMessages } from 'react-intl';
import { createSelector } from 'reselect';
import { v4 as uuid } from 'uuid';

import { patchMe } from 'soapbox/actions/me';
import { isLoggedIn } from 'soapbox/utils/auth';

import { showAlertForError } from './alerts';
import snackbar from './snackbar';

import type { AppDispatch, RootState } from 'soapbox/store';

const SETTING_CHANGE = 'SETTING_CHANGE';
const SETTING_SAVE   = 'SETTING_SAVE';
const SETTINGS_UPDATE = 'SETTINGS_UPDATE';

const FE_NAME = 'soapbox_fe';

/** Options when changing/saving settings. */
type SettingOpts = {
  /** Whether to display an alert when settings are saved. */
  showAlert?: boolean,
}

const messages = defineMessages({
  saveSuccess: { id: 'settings.save.success', defaultMessage: 'Your preferences have been saved!' },
});

const defaultSettings = ImmutableMap({
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
  themeMode: 'system',
  locale: navigator.language.split(/[-_]/)[0] || 'en',
  showExplanationBox: true,
  explanationBox: true,
  autoloadTimelines: true,
  autoloadMore: true,

  systemFont: false,
  dyslexicFont: false,
  demetricator: false,

  isDeveloper: false,

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
      follow_request: true,
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

    birthdays: ImmutableMap({
      show: true,
    }),
  }),

  community: ImmutableMap({
    shows: ImmutableMap({
      reblog: false,
      reply: true,
      direct: false,
    }),
    other: ImmutableMap({
      onlyMedia: false,
    }),
    regex: ImmutableMap({
      body: '',
    }),
  }),

  public: ImmutableMap({
    bubble: true,
    shows: ImmutableMap({
      reblog: true,
      reply: true,
      direct: false,
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
      direct: false,
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

const getSettings = createSelector([
  (state: RootState) => state.soapbox.get('defaultSettings'),
  (state: RootState) => state.settings,
], (soapboxSettings, settings) => {
  return defaultSettings
    .mergeDeep(soapboxSettings)
    .mergeDeep(settings);
});

const changeSettingImmediate = (path: string[], value: any, opts?: SettingOpts) =>
  (dispatch: AppDispatch) => {
    dispatch({
      type: SETTING_CHANGE,
      path,
      value,
    });

    dispatch(saveSettingsImmediate(opts));
  };

const changeSetting = (path: string[], value: any, opts?: SettingOpts) =>
  (dispatch: AppDispatch) => {
    dispatch({
      type: SETTING_CHANGE,
      path,
      value,
    });

    return dispatch(saveSettings(opts));
  };

const saveSettingsImmediate = (opts?: SettingOpts) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const state = getState();
    if (getSettings(state).getIn(['saved'])) return;

    const data = state.settings.delete('saved').toJS();

    dispatch(patchMe({
      pleroma_settings_store: {
        [FE_NAME]: data,
      },
    })).then(() => {
      dispatch({ type: SETTING_SAVE });

      if (opts?.showAlert) {
        dispatch(snackbar.success(messages.saveSuccess));
      }
    }).catch(error => {
      dispatch(showAlertForError(error));
    });
  };

const saveSettings = (opts?: SettingOpts) =>
  (dispatch: AppDispatch) => dispatch(saveSettingsImmediate(opts));

export {
  SETTING_CHANGE,
  SETTING_SAVE,
  SETTINGS_UPDATE,
  FE_NAME,
  defaultSettings,
  getSettings,
  changeSettingImmediate,
  changeSetting,
  saveSettingsImmediate,
  saveSettings,
};

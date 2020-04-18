import api from '../api';
import { fetchMeSuccess } from 'gabsocial/actions/me';
import { debounce } from 'lodash';
import { showAlertForError } from './alerts';

export const MASTO_PREFS_FETCH_SUCCESS = 'MASTO_PREFS_FETCH_SUCCESS';
export const PREFERENCE_CHANGE         = 'PREFERENCE_CHANGE';
export const PREFERENCE_SAVE           = 'PREFERENCE_SAVE';

export const FE_NAME = 'soapbox_fe';

export function fetchMastoPreferences() {
  return (dispatch, getState) => {
    api(getState).get('/api/v1/preferences').then(response => {
      dispatch(mastoFetchPrefsSuccess(response.data));
    }).catch(e => {
      console.error(e);
      console.error('Could not fetch Mastodon preferences.');
    });
  };
}

export function mastoFetchPrefsSuccess(prefs) {
  return {
    type: MASTO_PREFS_FETCH_SUCCESS,
    prefs,
  };
}

export function changePreference(path, value) {
  return dispatch => {
    dispatch({
      type: PREFERENCE_CHANGE,
      path,
      value,
    });

    dispatch(savePreferences());
  };
};

const debouncedSave = debounce((dispatch, getState) => {
  if (!getState().get('me')) return;
  if (getState().getIn(['preferences', 'saved'])) return;

  const data = getState().get('preferences').delete('saved').toJS();

  api(getState).patch('/api/v1/accounts/update_credentials', {
    pleroma_settings_store: {
      [FE_NAME]: data,
    },
  }).then(response => {
    dispatch({ type: PREFERENCE_SAVE });
    dispatch(fetchMeSuccess(response.data));
  }).catch(error => {
    dispatch(showAlertForError(error));
  });
}, 5000, { trailing: true });

export function savePreferences() {
  return (dispatch, getState) => debouncedSave(dispatch, getState);
};

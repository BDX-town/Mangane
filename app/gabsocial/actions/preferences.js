import api from '../api';

export const MASTO_PREFS_FETCH_SUCCESS = 'MASTO_PREFS_FETCH_SUCCESS';

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

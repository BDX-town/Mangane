import api from '../api';
import { debounce } from 'lodash';
import { showAlertForError } from './alerts';
import { fetchMeSuccess } from 'gabsocial/actions/me';

export const SETTING_CHANGE = 'SETTING_CHANGE';
export const SETTING_SAVE   = 'SETTING_SAVE';

export const FE_NAME = 'soapbox_fe';

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
  if (!getState().get('me')) return;
  if (getState().getIn(['settings', 'saved'])) return;

  const data = getState().get('settings').delete('saved').toJS();

  api(getState).patch('/api/v1/accounts/update_credentials', {
    pleroma_settings_store: {
      [FE_NAME]: data,
    },
  }).then(response => {
    dispatch({ type: SETTING_SAVE });
    dispatch(fetchMeSuccess(response.data));
  }).catch(error => {
    dispatch(showAlertForError(error));
  });
}, 5000, { trailing: true });

export function saveSettings() {
  return (dispatch, getState) => debouncedSave(dispatch, getState);
};

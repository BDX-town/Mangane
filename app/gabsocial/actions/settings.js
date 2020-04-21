import { debounce } from 'lodash';
import { showAlertForError } from './alerts';
import { patchMe } from 'gabsocial/actions/me';

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
  const state = getState();
  if (!state.get('me')) return;
  if (state.getIn(['settings', 'saved'])) return;

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

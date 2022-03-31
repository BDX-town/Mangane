import { defineMessages } from 'react-intl';

import { httpErrorMessages } from 'soapbox/utils/errors';

const messages = defineMessages({
  unexpectedTitle: { id: 'alert.unexpected.title', defaultMessage: 'Oops!' },
  unexpectedMessage: { id: 'alert.unexpected.message', defaultMessage: 'An unexpected error occurred.' },
});

export const ALERT_SHOW    = 'ALERT_SHOW';
export const ALERT_DISMISS = 'ALERT_DISMISS';
export const ALERT_CLEAR   = 'ALERT_CLEAR';

const noOp = () => {};

export function dismissAlert(alert) {
  return {
    type: ALERT_DISMISS,
    alert,
  };
}

export function clearAlert() {
  return {
    type: ALERT_CLEAR,
  };
}

export function showAlert(title = messages.unexpectedTitle, message = messages.unexpectedMessage, severity = 'info') {
  return {
    type: ALERT_SHOW,
    title,
    message,
    severity,
  };
}

export function showAlertForError(error) {
  return (dispatch, _getState) => {
    if (error.response) {
      const { data, status, statusText } = error.response;

      if (status === 502) {
        return dispatch(showAlert('', 'The server is down', 'error'));
      }

      if (status === 404 || status === 410) {
        // Skip these errors as they are reflected in the UI
        return dispatch(noOp);
      }

      let message = statusText;

      if (data.error) {
        message = data.error;
      }

      if (!message) {
        message = httpErrorMessages.find((httpError) => httpError.code === status)?.description;
      }

      return dispatch(showAlert('', message, 'error'));
    } else {
      console.error(error);
      return dispatch(showAlert(undefined, undefined, 'error'));
    }
  };
}

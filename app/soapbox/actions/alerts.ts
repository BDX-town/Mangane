import { defineMessages, MessageDescriptor } from 'react-intl';

import { httpErrorMessages } from 'soapbox/utils/errors';

import type { SnackbarActionSeverity } from './snackbar';
import type { AnyAction } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import type { NotificationObject } from 'soapbox/react-notification';

const messages = defineMessages({
  unexpectedTitle: { id: 'alert.unexpected.title', defaultMessage: 'Oops!' },
  unexpectedMessage: { id: 'alert.unexpected.message', defaultMessage: 'An unexpected error occurred.' },
});

export const ALERT_SHOW = 'ALERT_SHOW';
export const ALERT_DISMISS = 'ALERT_DISMISS';
export const ALERT_CLEAR = 'ALERT_CLEAR';

const noOp = () => { };

function dismissAlert(alert: NotificationObject) {
  return {
    type: ALERT_DISMISS,
    alert,
  };
}

function showAlert(
  title: MessageDescriptor | string = messages.unexpectedTitle,
  message: MessageDescriptor | string = messages.unexpectedMessage,
  severity: SnackbarActionSeverity = 'info',
) {
  return {
    type: ALERT_SHOW,
    title,
    message,
    severity,
  };
}

const showAlertForError = (error: AxiosError<any>) => (dispatch: React.Dispatch<AnyAction>, _getState: any) => {
  if (error?.response) {
    const { data, status, statusText } = error.response;

    if (status === 502) {
      return dispatch(showAlert('', 'The server is down', 'error'));
    }

    if (status === 404 || status === 410) {
      // Skip these errors as they are reflected in the UI
      return dispatch(noOp as any);
    }

    let message: string | undefined = statusText;

    if (data?.error) {
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

export {
  dismissAlert,
  showAlert,
  showAlertForError,
};

import { ALERT_SHOW } from './alerts';

import type { MessageDescriptor } from 'react-intl';

export type SnackbarActionSeverity = 'info' | 'success' | 'error'

type SnackbarMessage = string | MessageDescriptor

export type SnackbarAction = {
  type: typeof ALERT_SHOW
  message: SnackbarMessage
  actionLabel?: SnackbarMessage
  actionLink?: string
  severity: SnackbarActionSeverity
}

export const show = (severity: SnackbarActionSeverity, message: SnackbarMessage, actionLabel?: SnackbarMessage, actionLink?: string): SnackbarAction => ({
  type: ALERT_SHOW,
  message,
  actionLabel,
  actionLink,
  severity,
});

export const info = (message: SnackbarMessage, actionLabel?: SnackbarMessage, actionLink?: string) =>
  show('info', message, actionLabel, actionLink);

export const success = (message: SnackbarMessage, actionLabel?: SnackbarMessage, actionLink?: string) =>
  show('success', message, actionLabel, actionLink);

export const error = (message: SnackbarMessage, actionLabel?: SnackbarMessage, actionLink?: string) =>
  show('error', message, actionLabel, actionLink);

export default {
  info,
  success,
  error,
  show,
};

import { ALERT_SHOW } from './alerts';

const showAlert = (severity, message) => ({
  type: ALERT_SHOW,
  message,
  severity,
});

export function info(message) {
  return showAlert('info', message);
};

export function success(message) {
  return showAlert('success', message);
};

export function error(message) {
  return showAlert('error', message);
};

export default {
  info,
  success,
  error,
};

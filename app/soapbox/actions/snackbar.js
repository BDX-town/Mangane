import { ALERT_SHOW } from './alerts';

const show = (severity, message) => ({
  type: ALERT_SHOW,
  message,
  severity,
});

export function info(message) {
  return show('info', message);
}

export function success(message) {
  return show('success', message);
}

export function error(message) {
  return show('error', message);
}

export default {
  info,
  success,
  error,
};

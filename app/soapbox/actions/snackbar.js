import { ALERT_SHOW } from './alerts';

export const show = (severity, message, actionLabel, actionLink) => ({
  type: ALERT_SHOW,
  message,
  actionLabel,
  actionLink,
  severity,
});

export function info(message, actionLabel, actionLink) {
  return show('info', message, actionLabel, actionLink);
}

export function success(message, actionLabel, actionLink) {
  return show('success', message, actionLabel, actionLink);
}

export function error(message, actionLabel, actionLink) {
  return show('error', message, actionLabel, actionLink);
}

export default {
  info,
  success,
  error,
  show,
};

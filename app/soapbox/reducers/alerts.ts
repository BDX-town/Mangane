import { Record as ImmutableRecord, List as ImmutableList } from 'immutable';

import {
  ALERT_SHOW,
  ALERT_DISMISS,
  ALERT_CLEAR,
} from '../actions/alerts';

const AlertRecord = ImmutableRecord({
  key: 0,
  title: '',
  message: '',
  severity: 'info',
  actionLabel: '',
  actionLink: '',
});

import type { AnyAction } from 'redux';

type PlainAlert = Record<string, any>;
type Alert = ReturnType<typeof AlertRecord>;
type State = ImmutableList<Alert>;

// Get next key based on last alert
const getNextKey = (state: State): number => {
  const last = state.last();
  return last ? last.key + 1 : 0;
};

// Import the alert
const importAlert = (state: State, alert: PlainAlert): State => {
  const key = getNextKey(state);
  const record = AlertRecord({ ...alert, key });
  return state.push(record);
};

// Delete an alert by its key
const deleteAlert = (state: State, alert: PlainAlert): State => {
  return state.filterNot(item => item.key === alert.key);
};

export default function alerts(state: State = ImmutableList<Alert>(), action: AnyAction): State {
  switch (action.type) {
    case ALERT_SHOW:
      return importAlert(state, action);
    case ALERT_DISMISS:
      return deleteAlert(state, action.alert);
    case ALERT_CLEAR:
      return state.clear();
    default:
      return state;
  }
}

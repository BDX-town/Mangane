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

const initialState = ImmutableList();

// Get next key based on last alert
const getNextKey = state => state.size > 0 ? state.last().get('key') + 1 : 0;

// Import the alert
const importAlert = (state, alert) => {
  const key = getNextKey(state);
  const record = AlertRecord({ ...alert, key });
  return state.push(record);
};

// Delete an alert by its key
const deleteAlert = (state, alert) => {
  return state.filterNot(item => item.key === alert.key);
};

export default function alerts(state = initialState, action) {
  switch(action.type) {
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

import api from '../api';

export function getSubscribersCsv() {
  return (dispatch, getState) => {
    return api(getState).get('/api/v1/pleroma/admin/email_list/subscribers.csv');
  };
}

export function getUnsubscribersCsv() {
  return (dispatch, getState) => {
    return api(getState).get('/api/v1/pleroma/admin/email_list/unsubscribers.csv');
  };
}

export function getCombinedCsv() {
  return (dispatch, getState) => {
    return api(getState).get('/api/v1/pleroma/admin/email_list/combined.csv');
  };
}

import { getSettings } from '../settings';
import {
  normalizeStatus,
  normalizePoll,
} from './normalizer';

export const STATUS_IMPORT   = 'STATUS_IMPORT';
export const STATUSES_IMPORT = 'STATUSES_IMPORT';
export const POLLS_IMPORT    = 'POLLS_IMPORT';
export const ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP = 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP';

function pushUnique(array, object) {
  if (array.every(element => element.id !== object.id)) {
    array.push(object);
  }
}

export function importStatus(status) {
  return { type: STATUS_IMPORT, status };
}

export function importStatuses(statuses) {
  return { type: STATUSES_IMPORT, statuses };
}

export function importPolls(polls) {
  return { type: POLLS_IMPORT, polls };
}

export function importFetchedStatus(status) {
  return importFetchedStatuses([status]);
}

// Sometimes Pleroma can return an empty account,
// or a repost can appear of a deleted account. Skip these statuses.
const isBroken = status => {
  try {
    // Skip empty accounts
    // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/424
    if (!status.account.id) return true;
    // Skip broken reposts
    // https://gitlab.com/soapbox-pub/soapbox/-/issues/28
    if (status.reblog && !status.reblog.account.id) return true;
    return false;
  } catch(e) {
    return true;
  }
};

export function importFetchedStatuses(statuses) {
  return (dispatch, getState) => {
    const accounts = [];
    const normalStatuses = [];
    const polls = [];

    function processStatus(status) {
      // Skip broken statuses
      if (isBroken(status)) return;

      const normalOldStatus = getState().getIn(['statuses', status.id]);
      const expandSpoilers = getSettings(getState()).get('expandSpoilers');

      pushUnique(normalStatuses, normalizeStatus(status, normalOldStatus, expandSpoilers));
      pushUnique(accounts, status.account);

      if (status.reblog && status.reblog.id) {
        processStatus(status.reblog);
      }

      if (status.poll && status.poll.id) {
        pushUnique(polls, normalizePoll(status.poll));
      }
    }

    statuses.forEach(processStatus);

    dispatch(importPolls(polls));
    dispatch(importStatuses(normalStatuses));
  };
}

export function importFetchedPoll(poll) {
  return dispatch => {
    dispatch(importPolls([normalizePoll(poll)]));
  };
}

export function importErrorWhileFetchingAccountByUsername(username) {
  return { type: ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP, username };
};

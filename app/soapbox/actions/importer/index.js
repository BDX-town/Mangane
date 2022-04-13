import { getSettings } from '../settings';

export const ACCOUNT_IMPORT  = 'ACCOUNT_IMPORT';
export const ACCOUNTS_IMPORT = 'ACCOUNTS_IMPORT';
export const STATUS_IMPORT   = 'STATUS_IMPORT';
export const STATUSES_IMPORT = 'STATUSES_IMPORT';
export const POLLS_IMPORT    = 'POLLS_IMPORT';
export const ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP = 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP';

export function importAccount(account) {
  return { type: ACCOUNT_IMPORT, account };
}

export function importAccounts(accounts) {
  return { type: ACCOUNTS_IMPORT, accounts };
}

export function importStatus(status, idempotencyKey) {
  return (dispatch, getState) => {
    const expandSpoilers = getSettings(getState()).get('expandSpoilers');
    return dispatch({ type: STATUS_IMPORT, status, idempotencyKey, expandSpoilers });
  };
}

export function importStatuses(statuses) {
  return (dispatch, getState) => {
    const expandSpoilers = getSettings(getState()).get('expandSpoilers');
    return dispatch({ type: STATUSES_IMPORT, statuses, expandSpoilers });
  };
}

export function importPolls(polls) {
  return { type: POLLS_IMPORT, polls };
}

export function importFetchedAccount(account) {
  return importFetchedAccounts([account]);
}

export function importFetchedAccounts(accounts) {
  const normalAccounts = [];

  function processAccount(account) {
    if (!account.id) return;

    normalAccounts.push(account);

    if (account.moved) {
      processAccount(account.moved);
    }
  }

  accounts.forEach(processAccount);

  return importAccounts(normalAccounts);
}

export function importFetchedStatus(status, idempotencyKey) {
  return (dispatch, getState) => {
    // Skip broken statuses
    if (isBroken(status)) return;

    if (status.reblog?.id) {
      dispatch(importFetchedStatus(status.reblog));
    }

    // Fedibird quotes
    if (status.quote?.id) {
      dispatch(importFetchedStatus(status.quote));
    }

    if (status.pleroma?.quote?.id) {
      dispatch(importFetchedStatus(status.pleroma.quote));
    }

    if (status.poll?.id) {
      dispatch(importFetchedPoll(status.poll));
    }

    dispatch(importFetchedAccount(status.account));
    dispatch(importStatus(status, idempotencyKey));
  };
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
  } catch (e) {
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

      normalStatuses.push(status);
      accounts.push(status.account);

      if (status.reblog?.id) {
        processStatus(status.reblog);
      }

      // Fedibird quotes
      if (status.quote?.id) {
        processStatus(status.quote);
      }

      if (status.pleroma?.quote?.id) {
        processStatus(status.pleroma.quote);
      }

      if (status.poll?.id) {
        polls.push(status.poll);
      }
    }

    statuses.forEach(processStatus);

    dispatch(importPolls(polls));
    dispatch(importFetchedAccounts(accounts));
    dispatch(importStatuses(normalStatuses));
  };
}

export function importFetchedPoll(poll) {
  return dispatch => {
    dispatch(importPolls([poll]));
  };
}

export function importErrorWhileFetchingAccountByUsername(username) {
  return { type: ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP, username };
}

import { getFilters } from 'soapbox/selectors';

import { getSettings } from '../settings';

import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

const ACCOUNT_IMPORT  = 'ACCOUNT_IMPORT';
const ACCOUNTS_IMPORT = 'ACCOUNTS_IMPORT';
const STATUS_IMPORT   = 'STATUS_IMPORT';
const STATUSES_IMPORT = 'STATUSES_IMPORT';
const POLLS_IMPORT    = 'POLLS_IMPORT';
const ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP = 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP';

export function importAccount(account: APIEntity) {
  return { type: ACCOUNT_IMPORT, account };
}

export function importAccounts(accounts: APIEntity[]) {
  return { type: ACCOUNTS_IMPORT, accounts };
}

export function importStatus(status: APIEntity, idempotencyKey?: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const expandSpoilers = getSettings(getState()).get('expandSpoilers');
    const filters = getFilters(getState(), null);
    return dispatch({ type: STATUS_IMPORT, status, idempotencyKey, expandSpoilers, filters });
  };
}

export function importStatuses(statuses: APIEntity[]) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const expandSpoilers = getSettings(getState()).get('expandSpoilers');
    const filters = getFilters(getState(), null);
    return dispatch({ type: STATUSES_IMPORT, statuses, expandSpoilers, filters });
  };
}

export function importPolls(polls: APIEntity[]) {
  return { type: POLLS_IMPORT, polls };
}

export function importFetchedAccount(account: APIEntity) {
  return importFetchedAccounts([account]);
}

export function importFetchedAccounts(accounts: APIEntity[], args = { should_refetch: false }) {
  const { should_refetch } = args;
  const normalAccounts: APIEntity[] = [];

  const processAccount = (account: APIEntity) => {
    if (!account.id) return;

    if (should_refetch) {
      account.should_refetch = true;
    }

    normalAccounts.push(account);

    if (account.moved) {
      processAccount(account.moved);
    }
  };

  accounts.forEach(processAccount);

  return importAccounts(normalAccounts);
}

export function importFetchedStatus(status: APIEntity, idempotencyKey?: string) {
  return (dispatch: AppDispatch) => {
    // Skip broken statuses
    if (isBroken(status)) return;

    if (status.reblog?.id) {
      dispatch(importFetchedStatus(status.reblog));
    }

    // Fedibird quotes
    if (status.quote?.id) {
      dispatch(importFetchedStatus(status.quote));
    }

    // Pleroma quotes
    if (status.pleroma?.quote?.id) {
      dispatch(importFetchedStatus(status.pleroma.quote));
    }

    // Fedibird quote from reblog
    if (status.reblog?.quote?.id) {
      dispatch(importFetchedStatus(status.reblog.quote));
    }

    // Pleroma quote from reblog
    if (status.reblog?.pleroma?.quote?.id) {
      dispatch(importFetchedStatus(status.reblog.pleroma.quote));
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
const isBroken = (status: APIEntity) => {
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

export function importFetchedStatuses(statuses: APIEntity[]) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const accounts: APIEntity[] = [];
    const normalStatuses: APIEntity[] = [];
    const polls: APIEntity[] = [];

    function processStatus(status: APIEntity) {
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

export function importFetchedPoll(poll: APIEntity) {
  return (dispatch: AppDispatch) => {
    dispatch(importPolls([poll]));
  };
}

export function importErrorWhileFetchingAccountByUsername(username: string) {
  return { type: ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP, username };
}

export {
  ACCOUNT_IMPORT,
  ACCOUNTS_IMPORT,
  STATUS_IMPORT,
  STATUSES_IMPORT,
  POLLS_IMPORT,
  ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
};

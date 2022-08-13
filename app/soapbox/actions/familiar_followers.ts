import { RootState } from 'soapbox/store';

import api from '../api';

import { ACCOUNTS_IMPORT, importFetchedAccounts } from './importer';

import type { APIEntity } from 'soapbox/types/entities';

export const FAMILIAR_FOLLOWERS_FETCH_REQUEST = 'FAMILIAR_FOLLOWERS_FETCH_REQUEST';
export const FAMILIAR_FOLLOWERS_FETCH_SUCCESS = 'FAMILIAR_FOLLOWERS_FETCH_SUCCESS';
export const FAMILIAR_FOLLOWERS_FETCH_FAIL    = 'FAMILIAR_FOLLOWERS_FETCH_FAIL';

type FamiliarFollowersFetchRequestAction = {
  type: typeof FAMILIAR_FOLLOWERS_FETCH_REQUEST,
  id: string,
}

type FamiliarFollowersFetchRequestSuccessAction = {
  type: typeof FAMILIAR_FOLLOWERS_FETCH_SUCCESS,
  id: string,
  accounts: Array<APIEntity>,
}

type FamiliarFollowersFetchRequestFailAction = {
  type: typeof FAMILIAR_FOLLOWERS_FETCH_FAIL,
  id: string,
  error: any,
}

type AccountsImportAction = {
  type: typeof ACCOUNTS_IMPORT,
  accounts: Array<APIEntity>,
}

export type FamiliarFollowersActions = FamiliarFollowersFetchRequestAction | FamiliarFollowersFetchRequestSuccessAction | FamiliarFollowersFetchRequestFailAction | AccountsImportAction

export const fetchAccountFamiliarFollowers = (accountId: string) => (dispatch: React.Dispatch<FamiliarFollowersActions>, getState: () => RootState) => {
  dispatch({
    type: FAMILIAR_FOLLOWERS_FETCH_REQUEST,
    id: accountId,
  });

  api(getState).get(`/api/v1/accounts/familiar_followers?id=${accountId}`)
    .then(({ data }) => {
      const accounts = data.find(({ id }: { id: string }) => id === accountId).accounts;

      dispatch(importFetchedAccounts(accounts) as AccountsImportAction);
      dispatch({
        type: FAMILIAR_FOLLOWERS_FETCH_SUCCESS,
        id: accountId,
        accounts,
      });
    })
    .catch(error => dispatch({
      type: FAMILIAR_FOLLOWERS_FETCH_FAIL,
      id: accountId,
      error,
    }));
};

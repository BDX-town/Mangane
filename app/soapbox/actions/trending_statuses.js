import { getFeatures } from 'soapbox/utils/features';

import api from '../api';

import { importFetchedStatuses } from './importer';

export const TRENDING_STATUSES_FETCH_REQUEST = 'TRENDING_STATUSES_FETCH_REQUEST';
export const TRENDING_STATUSES_FETCH_SUCCESS = 'TRENDING_STATUSES_FETCH_SUCCESS';
export const TRENDING_STATUSES_FETCH_FAIL    = 'TRENDING_STATUSES_FETCH_FAIL';

export function fetchTrendingStatuses() {
  return (dispatch, getState) => {
    const state = getState();

    const instance = state.get('instance');
    const features = getFeatures(instance);

    dispatch({ type: TRENDING_STATUSES_FETCH_REQUEST });
    return api(getState).get(features.trendingTruths ? '/api/v1/truth/trending/truths' : '/api/v1/trends/statuses').then(({ data: statuses }) => {
      dispatch(importFetchedStatuses(statuses));
      dispatch({ type: TRENDING_STATUSES_FETCH_SUCCESS, statuses });
      return statuses;
    }).catch(error => {
      dispatch({ type: TRENDING_STATUSES_FETCH_FAIL, error });
    });
  };
}

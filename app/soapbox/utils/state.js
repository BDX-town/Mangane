/**
 * State: general Redux state utility functions.
 * @module soapbox/utils/state
 */

import { getSoapboxConfig } from'soapbox/actions/soapbox';
import { createSelector } from 'reselect';
import { isPrerendered } from 'soapbox/precheck';
import { isURL } from 'soapbox/utils/auth';
import { BACKEND_URL } from 'soapbox/build_config';

export const displayFqn = state => {
  const soapbox = getSoapboxConfig(state);
  return soapbox.get('displayFqn');
};

export const federationRestrictionsDisclosed = state => {
  return state.hasIn(['instance', 'pleroma', 'metadata', 'federation', 'mrf_policies']);
};

/**
 * Determine whether Soapbox FE is running in standalone mode.
 * Standalone mode runs separately from any backend and can login anywhere.
 * @param {object} state
 * @returns {boolean}
 */
export const isStandalone = state => createSelector([
  state => state.getIn(['meta', 'instance_fetch_failed'], false),
], instanceFetchFailed => {
  return isURL(BACKEND_URL) ? false : (!isPrerendered && instanceFetchFailed);
});

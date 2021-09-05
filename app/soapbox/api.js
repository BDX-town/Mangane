/**
 * API: HTTP client and utilities.
 * @see {@link https://github.com/axios/axios}
 * @module soapbox/api
 */
'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';
import { getAccessToken, getAppToken, parseBaseURL } from 'soapbox/utils/auth';
import { createSelector } from 'reselect';
import { BACKEND_URL, FE_SUBDIRECTORY } from 'soapbox/build_config';
import { isURL } from 'soapbox/utils/auth';

/**
 Parse Link headers, mostly for pagination.
 @see {@link https://www.npmjs.com/package/http-link-header}
 @param {object} response - Axios response object
 @returns {object} Link object
 */
export const getLinks = response => {
  const value = response.headers.link;
  if (!value) return { refs: [] };
  return LinkHeader.parse(value);
};

const getToken = (state, authType) => {
  return authType === 'app' ? getAppToken(state) : getAccessToken(state);
};

const maybeParseJSON = data => {
  try {
    return JSON.parse(data);
  } catch(Exception) {
    return data;
  }
};

const getAuthBaseURL = createSelector([
  (state, me) => state.getIn(['accounts', me, 'url']),
  (state, me) => state.getIn(['auth', 'me']),
], (accountUrl, authUserUrl) => {
  const baseURL = parseBaseURL(accountUrl) || parseBaseURL(authUserUrl);
  return baseURL !== window.location.origin ? baseURL : '';
});

/**
 * Base client for HTTP requests.
 * @param {string} accessToken
 * @param {string} baseURL
 * @returns {object} Axios instance
 */
export const baseClient = (accessToken, baseURL = '') => {
  return axios.create({
    // When BACKEND_URL is set, always use it.
    baseURL: isURL(BACKEND_URL) ? BACKEND_URL : baseURL,
    headers: Object.assign(accessToken ? {
      'Authorization': `Bearer ${accessToken}`,
    } : {}),

    transformResponse: [maybeParseJSON],
  });
};

/**
 * Dumb client for grabbing static files.
 * It uses FE_SUBDIRECTORY and parses JSON if possible.
 * No authorization is needed.
 */
export const staticClient = axios.create({
  baseURL: FE_SUBDIRECTORY,
  transformResponse: [maybeParseJSON],
});

/**
 * Stateful API client.
 * Uses credentials from the Redux store if available.
 * @param {function} getState - Must return the Redux state
 * @param {string} authType - Either 'user' or 'app'
 * @returns {object} Axios instance
 */
export default (getState, authType = 'user') => {
  const state = getState();
  const accessToken = getToken(state, authType);
  const me = state.get('me');
  const baseURL = getAuthBaseURL(state, me);

  return baseClient(accessToken, baseURL);
};

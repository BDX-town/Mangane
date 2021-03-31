'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';
import { getAccessToken, getAppToken } from 'soapbox/utils/auth';

export const getLinks = response => {
  const value = response.headers.link;
  if (!value) return { refs: [] };
  return LinkHeader.parse(value);
};

const getToken = (getState, authType) => {
  const state = getState();
  return authType === 'app' ? getAppToken(state) : getAccessToken(state);
};

const maybeParseJSON = data => {
  try {
    return JSON.parse(data);
  } catch(Exception) {
    return data;
  }
};

export const baseClient = accessToken => {
  return axios.create({
    headers: Object.assign(accessToken ? {
      'Authorization': `Bearer ${accessToken}`,
    } : {}),

    transformResponse: [maybeParseJSON],
  });
};

export default (getState, authType = 'user') => {
  const accessToken = getToken(getState, authType);
  return baseClient(accessToken);
};

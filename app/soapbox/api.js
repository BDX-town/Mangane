'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';

export const getLinks = response => {
  const value = response.headers.link;

  if (!value) {
    return { refs: [] };
  }

  return LinkHeader.parse(value);
};

const getToken = (getState, authType) =>
  getState().getIn(['auth', authType, 'access_token']);

export default (getState, authType = 'user') => {
  const accessToken = getToken(getState, authType);

  return axios.create({
    headers: Object.assign(accessToken ? {
      'Authorization': `Bearer ${accessToken}`,
    } : {}),

    transformResponse: [function(data) {
      try {
        return JSON.parse(data);
      } catch(Exception) {
        return data;
      }
    }],
  });
};

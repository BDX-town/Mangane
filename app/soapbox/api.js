'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';

export const getLinks = response => {
  const value = response.headers.link;
  if (!value) return { refs: [] };
  return LinkHeader.parse(value);
};

const getToken = (getState, authType) => {
  const state = getState();
  if (authType === 'app') {
    return state.getIn(['auth', 'app', 'access_token']);
  } else {
    const me = state.get('me');
    return state.getIn(['auth', 'users', me, 'access_token']);
  }
};

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

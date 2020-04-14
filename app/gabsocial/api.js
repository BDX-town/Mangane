'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';
import ready from './ready';

export const getLinks = response => {
  const value = response.headers.link;

  if (!value) {
    return { refs: [] };
  }

  return LinkHeader.parse(value);
};

let csrfHeader = {};

function setCSRFHeader() {
  const csrfToken = document.querySelector('meta[name=csrf-token]');
  if (csrfToken) {
    csrfHeader['X-CSRF-Token'] = csrfToken.content;
  }
}

ready(setCSRFHeader);

export default getState => {
  const user_token = getState().getIn(['auth', 'user', 'access_token']);
  const app_token  = getState().getIn(['auth', 'app', 'access_token']);
  const access_token = user_token || app_token;
  return axios.create({
    headers: Object.assign(csrfHeader, access_token ? {
      'Authorization': `Bearer ${access_token}`,
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

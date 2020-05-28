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

const getToken = (getState, authType) =>
  getState().getIn(['auth', authType, 'access_token']);

export default (getState, authType = 'user') => {
  const accessToken = getToken(getState, authType);

  return axios.create({
    headers: Object.assign(csrfHeader, accessToken ? {
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

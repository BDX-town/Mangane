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
  // TODO: getState is no longer needed
  const { access_token } = JSON.parse(localStorage.getItem('user')) || {};
  return axios.create({
    headers: Object.assign(csrfHeader, access_token ? {
      'Authorization': `Bearer ${access_token}`,
    } : {}),

    transformResponse: [function (data) {
      try {
        return JSON.parse(data);
      } catch(Exception) {
        return data;
      }
    }],
  });
};

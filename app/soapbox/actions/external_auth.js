/**
 * External Auth: workflow for logging in to remote servers.
 * @module soapbox/actions/external_auth
 * @see module:soapbox/actions/auth
 * @see module:soapbox/actions/apps
 * @see module:soapbox/actions/oauth
 */

import { createApp } from 'soapbox/actions/apps';
import { obtainOAuthToken } from 'soapbox/actions/oauth';
import { authLoggedIn, verifyCredentials } from 'soapbox/actions/auth';
import { parseBaseURL } from 'soapbox/utils/auth';
import sourceCode from 'soapbox/utils/code';

const scopes = 'read write follow push';

export function createAppAndRedirect(host) {
  return (dispatch, getState) => {
    const baseURL = parseBaseURL(host) || parseBaseURL(`https://${host}`);

    const params = {
      client_name:   sourceCode.displayName,
      redirect_uris: `${window.location.origin}/auth/external`,
      website:       sourceCode.homepage,
      scopes,
    };

    return dispatch(createApp(params, baseURL)).then(app => {
      const { client_id, redirect_uri } = app;

      const query = new URLSearchParams({
        client_id,
        redirect_uri,
        response_type: 'code',
        scopes,
      });

      localStorage.setItem('soapbox:external:app', JSON.stringify(app));
      localStorage.setItem('soapbox:external:baseurl', baseURL);

      window.location.href = `${baseURL}/oauth/authorize?${query.toString()}`;
    });
  };
}

export function loginWithCode(code) {
  return (dispatch, getState) => {
    const { client_id, client_secret } = JSON.parse(localStorage.getItem('soapbox:external:app'));
    const baseURL = localStorage.getItem('soapbox:external:baseurl');

    const params = {
      client_id,
      client_secret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'authorization_code',
      scope: scopes,
      code,
    };

    return dispatch(obtainOAuthToken(params, baseURL))
      .then(token => dispatch(authLoggedIn(token)))
      .then(({ access_token }) => dispatch(verifyCredentials(access_token, baseURL)))
      .then(() => window.location.href = '/');
  };
}

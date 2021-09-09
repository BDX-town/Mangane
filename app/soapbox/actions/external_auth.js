/**
 * External Auth: workflow for logging in to remote servers.
 * @module soapbox/actions/external_auth
 * @see module:soapbox/actions/auth
 * @see module:soapbox/actions/apps
 * @see module:soapbox/actions/oauth
 */

import { baseClient } from '../api';
import { createApp } from 'soapbox/actions/apps';
import { obtainOAuthToken } from 'soapbox/actions/oauth';
import { authLoggedIn, verifyCredentials, switchAccount } from 'soapbox/actions/auth';
import { parseBaseURL } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';
import sourceCode from 'soapbox/utils/code';
import { Map as ImmutableMap, fromJS } from 'immutable';

const fetchExternalInstance = baseURL => {
  return baseClient(null, baseURL)
    .get('/api/v1/instance')
    .then(({ data: instance }) => fromJS(instance))
    .catch(error => {
      if (error.response.status === 401) {
        // Authenticated fetch is enabled.
        // Continue with a limited featureset.
        return ImmutableMap({ version: '0.0.0' });
      } else {
        throw error;
      }
    });
};

export function createAppAndRedirect(host) {
  return (dispatch, getState) => {
    const baseURL = parseBaseURL(host) || parseBaseURL(`https://${host}`);

    return fetchExternalInstance(baseURL).then(instance => {
      const { scopes } = getFeatures(instance);

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
          scope: scopes,
        });

        localStorage.setItem('soapbox:external:app', JSON.stringify(app));
        localStorage.setItem('soapbox:external:baseurl', baseURL);
        localStorage.setItem('soapbox:external:scopes', scopes);

        window.location.href = `${baseURL}/oauth/authorize?${query.toString()}`;
      });
    });
  };
}

export function loginWithCode(code) {
  return (dispatch, getState) => {
    const { client_id, client_secret, redirect_uri } = JSON.parse(localStorage.getItem('soapbox:external:app'));
    const baseURL = localStorage.getItem('soapbox:external:baseurl');
    const scope   = localStorage.getItem('soapbox:external:scopes');

    const params = {
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code',
      scope,
      code,
    };

    return dispatch(obtainOAuthToken(params, baseURL))
      .then(token => dispatch(authLoggedIn(token)))
      .then(({ access_token }) => dispatch(verifyCredentials(access_token, baseURL)))
      .then(account => dispatch(switchAccount(account.id)))
      .then(() => window.location.href = '/');
  };
}

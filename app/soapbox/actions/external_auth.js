/**
 * External Auth: workflow for logging in to remote servers.
 * @module soapbox/actions/external_auth
 * @see module:soapbox/actions/auth
 * @see module:soapbox/actions/apps
 * @see module:soapbox/actions/oauth
 */

import { createApp } from 'soapbox/actions/apps';
import { authLoggedIn, verifyCredentials, switchAccount } from 'soapbox/actions/auth';
import { obtainOAuthToken } from 'soapbox/actions/oauth';
import { normalizeInstance } from 'soapbox/normalizers';
import { parseBaseURL } from 'soapbox/utils/auth';
import sourceCode from 'soapbox/utils/code';
import { getWalletAndSign } from 'soapbox/utils/ethereum';
import { getFeatures } from 'soapbox/utils/features';
import { getQuirks } from 'soapbox/utils/quirks';

import { baseClient } from '../api';

const fetchExternalInstance = baseURL => {
  return baseClient(null, baseURL)
    .get('/api/v1/instance')
    .then(({ data: instance }) => normalizeInstance(instance))
    .catch(error => {
      if (error.response?.status === 401) {
        // Authenticated fetch is enabled.
        // Continue with a limited featureset.
        return normalizeInstance({});
      } else {
        throw error;
      }
    });
};

function createExternalApp(instance, baseURL) {
  return (dispatch, getState) => {
    // Mitra: skip creating the auth app
    if (getQuirks(instance).noApps) return new Promise(f => f({}));

    const { scopes } = getFeatures(instance);

    const params = {
      client_name:   sourceCode.displayName,
      redirect_uris: `${window.location.origin}/login/external`,
      website:       sourceCode.homepage,
      scopes,
    };

    return dispatch(createApp(params, baseURL));
  };
}

function externalAuthorize(instance, baseURL) {
  return (dispatch, getState) => {
    const { scopes } = getFeatures(instance);

    return dispatch(createExternalApp(instance, baseURL)).then(app => {
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
  };
}

export function externalEthereumLogin(instance, baseURL) {
  return (dispatch, getState) => {
    const loginMessage = instance.get('login_message');

    return getWalletAndSign(loginMessage).then(({ wallet, signature }) => {
      return dispatch(createExternalApp(instance, baseURL)).then(app => {
        const params = {
          grant_type: 'ethereum',
          wallet_address: wallet.toLowerCase(),
          client_id: app.client_id,
          client_secret: app.client_secret,
          password: signature,
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
          scope: getFeatures(instance).scopes,
        };

        return dispatch(obtainOAuthToken(params, baseURL))
          .then(token => dispatch(authLoggedIn(token)))
          .then(({ access_token }) => dispatch(verifyCredentials(access_token, baseURL)))
          .then(account => dispatch(switchAccount(account.id)))
          .then(() => window.location.href = '/');
      });
    });
  };
}

export function externalLogin(host) {
  return (dispatch, getState) => {
    const baseURL = parseBaseURL(host) || parseBaseURL(`https://${host}`);

    return fetchExternalInstance(baseURL).then(instance => {
      const features = getFeatures(instance);
      const quirks = getQuirks(instance);

      if (features.ethereumLogin && quirks.noOAuthForm) {
        return dispatch(externalEthereumLogin(instance, baseURL));
      } else {
        return dispatch(externalAuthorize(instance, baseURL));
      }
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

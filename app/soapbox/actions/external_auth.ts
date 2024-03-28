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
import { getFeatures } from 'soapbox/utils/features';
import { getQuirks } from 'soapbox/utils/quirks';

import { baseClient } from '../api';

import type { AppDispatch } from 'soapbox/store';
import type { Instance } from 'soapbox/types/entities';

const fetchExternalInstance = (baseURL?: string) => {
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

const createExternalApp = (instance: Instance, baseURL?: string) =>
  (dispatch: AppDispatch) => {
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

const externalAuthorize = (instance: Instance, baseURL: string) =>
  (dispatch: AppDispatch) => {
    const { scopes } = getFeatures(instance);

    return dispatch(createExternalApp(instance, baseURL)).then((app) => {
      const { client_id, redirect_uri } = app as Record<string, string>;

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

export const externalLogin = (host: string) =>
  (dispatch: AppDispatch) => {
    const baseURL = parseBaseURL(host) || parseBaseURL(`https://${host}`);

    return fetchExternalInstance(baseURL).then((instance) => {
      dispatch(externalAuthorize(instance, baseURL));
    });
  };

export const loginWithCode = (code: string) =>
  (dispatch: AppDispatch) => {
    const { client_id, client_secret, redirect_uri } = JSON.parse(localStorage.getItem('soapbox:external:app')!);
    const baseURL = localStorage.getItem('soapbox:external:baseurl')!;
    const scope   = localStorage.getItem('soapbox:external:scopes')!;

    const params: Record<string, string> = {
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code',
      scope,
      code,
    };

    return dispatch(obtainOAuthToken(params, baseURL))
      .then((token: Record<string, string | number>) => dispatch(authLoggedIn(token)))
      .then(({ access_token }: any) => dispatch(verifyCredentials(access_token as string, baseURL)))
      .then((account: { id: string }) => dispatch(switchAccount(account.id)))
      .then(() => window.location.href = '/');
  };

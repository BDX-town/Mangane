import axios from 'axios';

import * as BuildConfig from 'soapbox/build_config';
import { isURL } from 'soapbox/utils/auth';
import sourceCode from 'soapbox/utils/code';
import { getFeatures } from 'soapbox/utils/features';

import { createApp } from './apps';

import type { AppDispatch, RootState } from 'soapbox/store';

const createProviderApp = () => {
  return async(dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { scopes } = getFeatures(state.instance);

    const params = {
      client_name:   sourceCode.displayName,
      redirect_uris: `${window.location.origin}/login/external`,
      website:       sourceCode.homepage,
      scopes,
    };

    return dispatch(createApp(params));
  };
};

export const prepareRequest = (provider: string) => {
  return async(dispatch: AppDispatch, getState: () => RootState) => {
    const baseURL = isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : '';

    const state = getState();
    const { scopes } = getFeatures(state.instance);
    const app = await dispatch(createProviderApp());
    const { client_id, redirect_uri } = app;

    localStorage.setItem('soapbox:external:app', JSON.stringify(app));
    localStorage.setItem('soapbox:external:baseurl', baseURL);
    localStorage.setItem('soapbox:external:scopes', scopes);

    const params = {
      provider,
      authorization: {
        client_id,
        redirect_uri,
        scope: scopes,
      },
    };

    const formdata = axios.toFormData(params);
    const query = new URLSearchParams(formdata as any);

    location.href = `${baseURL}/oauth/prepare_request?${query.toString()}`;
  };
};

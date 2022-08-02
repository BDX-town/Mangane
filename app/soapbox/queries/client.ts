import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';

import * as BuildConfig from 'soapbox/build_config';
import { isURL } from 'soapbox/utils/auth';

const maybeParseJSON = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (Exception) {
    return data;
  }
};

const API = axios.create({
  transformResponse: [maybeParseJSON],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      cacheTime: Infinity,
    },
  },
});

const useAxiosInterceptors = (token: string, baseApiUri: string) => {
  API.interceptors.request.use(
    async(config: AxiosRequestConfig) => {
      if (token) {
        config.baseURL = isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : baseApiUri;
        // eslint-disable-next-line no-param-reassign
        config.headers = {
          ...config.headers,
          Authorization: (token ? `Bearer ${token}` : null) as string | number | boolean | string[] | undefined,
        } as any;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

export { API as default, queryClient, useAxiosInterceptors };

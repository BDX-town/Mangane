import { jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import LinkHeader from 'http-link-header';

import type { AxiosInstance, AxiosResponse } from 'axios';

const api = jest.requireActual('../api') as Record<string, Function>;
let mocks: Array<Function> = [];

export const __stub = (func: (mock: MockAdapter) => void) => mocks.push(func);
export const __clear = (): Function[] => mocks = [];

const setupMock = (axios: AxiosInstance) => {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
  mocks.map(func => func(mock));
};

export const staticClient = api.staticClient;

export const getLinks = (response: AxiosResponse): LinkHeader => {
  return new LinkHeader(response.headers?.link);
};

export const baseClient = (...params: any[]) => {
  const axios = api.baseClient(...params);
  setupMock(axios);
  return axios;
};

export default (...params: any[]) => {
  const axios = api.default(...params);
  setupMock(axios);
  return axios;
};

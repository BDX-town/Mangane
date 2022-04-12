import { jest } from '@jest/globals';
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = jest.requireActual('../api') as Record<string, Function>;
let mocks: Array<Function> = [];

export const __stub = (func: Function) => mocks.push(func);
export const __clear = (): Function[] => mocks = [];

const setupMock = (axios: AxiosInstance) => {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
  mocks.map(func => func(mock));
};

export const staticClient = api.staticClient;

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

import MockAdapter from 'axios-mock-adapter';

const api = jest.requireActual('../api');
let mocks = [];

export const __stub = func => mocks.push(func);
export const __clear = () => mocks = [];

const setupMock = axios => {
  const mock = new MockAdapter(axios);
  mocks.map(func => func(mock));
};

export const staticClient = api.staticClient;

export default (...params) => {
  const axios = api.default(...params);
  setupMock(axios);
  return axios;
};

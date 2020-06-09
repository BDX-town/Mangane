import MockAdapter from 'axios-mock-adapter';

const api = jest.requireActual('../api').default;
let mocks = [];

export const __stub = func => mocks.push(func);

const setupMock = axios => {
  const mock = new MockAdapter(axios);
  mocks.map(func => func(mock));
};

export default (...params) => {
  const axios = api(...params);
  setupMock(axios);
  return axios;
};

import MockAdapter from 'axios-mock-adapter';

const api = jest.requireActual('../api').default;

export default (...params) => {
  const axiosInstance = api(...params);
  const mock = new MockAdapter(axiosInstance);
  mock.onGet('/instance/about/index.html').reply(200, '<h1>Hello world</h1>');
  return axiosInstance;
};

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  FETCH_ABOUT_PAGE_REQUEST,
  FETCH_ABOUT_PAGE_SUCCESS,
  fetchAboutPage,
} from '../about';
import { Map as ImmutableMap } from 'immutable';
import { __stub as stubApi } from 'soapbox/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchAboutPage()', () => {
  beforeAll(() => stubApi(mock => {
    mock.onGet('/instance/about/index.html').reply(200, '<h1>Hello world</h1>');
  }));

  it('creates the expected actions', () => {
    const expectedActions = [
      { type: FETCH_ABOUT_PAGE_REQUEST, slug: 'index' },
      { type: FETCH_ABOUT_PAGE_SUCCESS, slug: 'index' },
    ];
    const store = mockStore(ImmutableMap());

    return store.dispatch(fetchAboutPage()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

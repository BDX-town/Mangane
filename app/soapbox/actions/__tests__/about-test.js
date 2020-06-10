import {
  FETCH_ABOUT_PAGE_REQUEST,
  FETCH_ABOUT_PAGE_SUCCESS,
  FETCH_ABOUT_PAGE_FAIL,
  fetchAboutPage,
} from '../about';
import { Map as ImmutableMap } from 'immutable';
import { __stub as stubApi } from 'soapbox/api';
import { mockStore } from 'soapbox/test_helpers';

describe('fetchAboutPage()', () => {
  it('creates the expected actions on success', () => {

    stubApi(mock => {
      mock.onGet('/instance/about/index.html').reply(200, '<h1>Hello world</h1>');
    });

    const expectedActions = [
      { type: FETCH_ABOUT_PAGE_REQUEST, slug: 'index' },
      { type: FETCH_ABOUT_PAGE_SUCCESS, slug: 'index' },
    ];
    const store = mockStore(ImmutableMap());

    return store.dispatch(fetchAboutPage()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates the expected actions on failure', () => {
    const expectedActions = [
      { type: FETCH_ABOUT_PAGE_REQUEST, slug: 'asdf' },
      { type: FETCH_ABOUT_PAGE_FAIL, slug: 'asdf' },
    ];
    const store = mockStore(ImmutableMap());

    return store.dispatch(fetchAboutPage('asdf')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

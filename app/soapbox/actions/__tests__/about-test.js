import MockAdapter from 'axios-mock-adapter';
import { Map as ImmutableMap } from 'immutable';

import { staticClient } from 'soapbox/api';
import { mockStore } from 'soapbox/jest/test-helpers';

import {
  FETCH_ABOUT_PAGE_REQUEST,
  FETCH_ABOUT_PAGE_SUCCESS,
  FETCH_ABOUT_PAGE_FAIL,
  fetchAboutPage,
} from '../about';

describe('fetchAboutPage()', () => {
  it('creates the expected actions on success', () => {

    const mock = new MockAdapter(staticClient);

    mock.onGet('/instance/about/index.html')
      .reply(200, '<h1>Hello world</h1>');

    const expectedActions = [
      { type: FETCH_ABOUT_PAGE_REQUEST, slug: 'index' },
      { type: FETCH_ABOUT_PAGE_SUCCESS, slug: 'index', html: '<h1>Hello world</h1>' },
    ];
    const store = mockStore(ImmutableMap());

    return store.dispatch(fetchAboutPage()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates the expected actions on failure', () => {
    const expectedActions = [
      { type: FETCH_ABOUT_PAGE_REQUEST, slug: 'asdf' },
      { type: FETCH_ABOUT_PAGE_FAIL, slug: 'asdf', error: new Error('Request failed with status code 404') },
    ];
    const store = mockStore(ImmutableMap());

    return store.dispatch(fetchAboutPage('asdf')).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

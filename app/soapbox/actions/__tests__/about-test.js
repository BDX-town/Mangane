import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  FETCH_ABOUT_PAGE_REQUEST,
  FETCH_ABOUT_PAGE_SUCCESS,
  fetchAboutPage,
} from '../about';
import { Map as ImmutableMap } from 'immutable';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('About actions', () => {
  it('creates FETCH_ABOUT_PAGE_SUCCESS when fetching about page has been done', () => {
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

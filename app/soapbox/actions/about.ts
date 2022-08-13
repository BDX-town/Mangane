import { staticClient } from '../api';

import type { AnyAction } from 'redux';

const FETCH_ABOUT_PAGE_REQUEST = 'FETCH_ABOUT_PAGE_REQUEST';
const FETCH_ABOUT_PAGE_SUCCESS = 'FETCH_ABOUT_PAGE_SUCCESS';
const FETCH_ABOUT_PAGE_FAIL = 'FETCH_ABOUT_PAGE_FAIL';

const fetchAboutPage = (slug = 'index', locale?: string) => (dispatch: React.Dispatch<AnyAction>) => {
  dispatch({ type: FETCH_ABOUT_PAGE_REQUEST, slug, locale });

  const filename = `${slug}${locale ? `.${locale}` : ''}.html`;
  return staticClient.get(`/instance/about/${filename}`)
    .then(({ data: html }) => {
      dispatch({ type: FETCH_ABOUT_PAGE_SUCCESS, slug, locale, html });
      return html;
    })
    .catch(error => {
      dispatch({ type: FETCH_ABOUT_PAGE_FAIL, slug, locale, error });
      throw error;
    });
};

export {
  fetchAboutPage,
  FETCH_ABOUT_PAGE_REQUEST,
  FETCH_ABOUT_PAGE_SUCCESS,
  FETCH_ABOUT_PAGE_FAIL,
};

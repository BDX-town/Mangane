import { staticClient } from '../api';

import type { AppDispatch } from 'soapbox/store';

const FETCH_MOBILE_PAGE_REQUEST = 'FETCH_MOBILE_PAGE_REQUEST';
const FETCH_MOBILE_PAGE_SUCCESS = 'FETCH_MOBILE_PAGE_SUCCESS';
const FETCH_MOBILE_PAGE_FAIL    = 'FETCH_MOBILE_PAGE_FAIL';

const fetchMobilePage = (slug = 'index', locale?: string) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: FETCH_MOBILE_PAGE_REQUEST, slug, locale });
    const filename = `${slug}${locale ? `.${locale}` : ''}.html`;
    return staticClient.get(`/instance/mobile/${filename}`).then(({ data: html }) => {
      dispatch({ type: FETCH_MOBILE_PAGE_SUCCESS, slug, locale, html });
      return html;
    }).catch(error => {
      dispatch({ type: FETCH_MOBILE_PAGE_FAIL, slug, locale, error });
      throw error;
    });
  };

export {
  FETCH_MOBILE_PAGE_REQUEST,
  FETCH_MOBILE_PAGE_SUCCESS,
  FETCH_MOBILE_PAGE_FAIL,
  fetchMobilePage,
};
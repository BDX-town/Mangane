import { staticClient } from '../api';

export const FETCH_MOBILE_PAGE_REQUEST = 'FETCH_MOBILE_PAGE_REQUEST';
export const FETCH_MOBILE_PAGE_SUCCESS = 'FETCH_MOBILE_PAGE_SUCCESS';
export const FETCH_MOBILE_PAGE_FAIL    = 'FETCH_MOBILE_PAGE_FAIL';

export function fetchMobilePage(slug = 'index', locale) {
  return (dispatch, getState) => {
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
}

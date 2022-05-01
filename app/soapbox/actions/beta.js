import { staticClient } from '../api';

export const FETCH_BETA_PAGE_REQUEST = 'FETCH_BETA_PAGE_REQUEST';
export const FETCH_BETA_PAGE_SUCCESS = 'FETCH_BETA_PAGE_SUCCESS';
export const FETCH_BETA_PAGE_FAIL    = 'FETCH_BETA_PAGE_FAIL';

export function fetchBetaPage(slug = 'index', locale) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_BETA_PAGE_REQUEST, slug, locale });
    const filename = `${slug}${locale ? `.${locale}` : ''}.html`;
    return staticClient.get(`/instance/beta/${filename}`).then(({ data: html }) => {
      dispatch({ type: FETCH_BETA_PAGE_SUCCESS, slug, locale, html });
      return html;
    }).catch(error => {
      dispatch({ type: FETCH_BETA_PAGE_FAIL, slug, locale, error });
      throw error;
    });
  };
}

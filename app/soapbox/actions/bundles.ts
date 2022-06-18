const BUNDLE_FETCH_REQUEST = 'BUNDLE_FETCH_REQUEST';
const BUNDLE_FETCH_SUCCESS = 'BUNDLE_FETCH_SUCCESS';
const BUNDLE_FETCH_FAIL = 'BUNDLE_FETCH_FAIL';

const fetchBundleRequest = (skipLoading?: boolean) => ({
  type: BUNDLE_FETCH_REQUEST,
  skipLoading,
});

const fetchBundleSuccess = (skipLoading?: boolean) => ({
  type: BUNDLE_FETCH_SUCCESS,
  skipLoading,
});

const fetchBundleFail = (error: any, skipLoading?: boolean) => ({
  type: BUNDLE_FETCH_FAIL,
  error,
  skipLoading,
});

export {
  BUNDLE_FETCH_REQUEST,
  BUNDLE_FETCH_SUCCESS,
  BUNDLE_FETCH_FAIL,
  fetchBundleRequest,
  fetchBundleSuccess,
  fetchBundleFail,
};

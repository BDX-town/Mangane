import { AxiosResponse } from 'axios';

import { AppDispatch, RootState } from 'soapbox/store';

import api from '../api';

const CAROUSEL_AVATAR_REQUEST = 'CAROUSEL_AVATAR_REQUEST';
const CAROUSEL_AVATAR_SUCCESS = 'CAROUSEL_AVATAR_SUCCESS';
const CAROUSEL_AVATAR_FAIL = 'CAROUSEL_AVATAR_FAIL';

const fetchCarouselAvatars = () => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch({ type: CAROUSEL_AVATAR_REQUEST });

  return api(getState)
    .get('/api/v1/truth/carousels/avatars')
    .then((response: AxiosResponse) => dispatch({ type: CAROUSEL_AVATAR_SUCCESS, payload: response.data }))
    .catch(() => dispatch({ type: CAROUSEL_AVATAR_FAIL }));
};

export {
  CAROUSEL_AVATAR_REQUEST,
  CAROUSEL_AVATAR_SUCCESS,
  CAROUSEL_AVATAR_FAIL,
  fetchCarouselAvatars,
};

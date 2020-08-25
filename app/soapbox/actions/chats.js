import api from '../api';

export const CHATS_FETCH_REQUEST = 'CHATS_FETCH_REQUEST';
export const CHATS_FETCH_SUCCESS = 'CHATS_FETCH_SUCCESS';
export const CHATS_FETCH_FAIL    = 'CHATS_FETCH_FAIL';

export function fetchChats() {
  return (dispatch, getState) => {
    dispatch({ type: CHATS_FETCH_REQUEST });
    return api(getState).get('/api/v1/pleroma/chats').then(({ data }) => {
      dispatch({ type: CHATS_FETCH_SUCCESS, data });
    }).catch(error => {
      dispatch({ type: CHATS_FETCH_FAIL, error });
    });
  };
}

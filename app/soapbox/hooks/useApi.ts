import api from 'soapbox/api';

import { useAppDispatch } from './useAppDispatch';

/** Use stateful Axios client with auth from Redux. */
export const useApi = () => {
  const dispatch = useAppDispatch();

  return dispatch((_dispatch, getState) => {
    return api(getState);
  });
};

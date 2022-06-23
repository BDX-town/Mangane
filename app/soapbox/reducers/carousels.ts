import { AnyAction } from 'redux';

import {
  CAROUSEL_AVATAR_REQUEST,
  CAROUSEL_AVATAR_SUCCESS,
  CAROUSEL_AVATAR_FAIL,
} from '../actions/carousels';

type Avatar = {
  account_id: string
  account_avatar: string
  username: string
}

type CarouselsState = {
  avatars: Avatar[]
  isLoading: boolean
  error: boolean
}

const initialState: CarouselsState = {
  avatars: [],
  isLoading: false,
  error: false,
};

export default function rules(state: CarouselsState = initialState, action: AnyAction): CarouselsState {
  switch (action.type) {
    case CAROUSEL_AVATAR_REQUEST:
      return { ...state, isLoading: true };
    case CAROUSEL_AVATAR_SUCCESS:
      return { ...state, isLoading: false, avatars: action.payload };
    case CAROUSEL_AVATAR_FAIL:
      return { ...state, isLoading: false, error: true };
    default:
      return state;
  }
}

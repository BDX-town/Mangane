import {
  SET_THEME,
} from '../actions/theme';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap();

export default function theme(state = initialState, action) {
  switch(action.type) {
  case SET_THEME:
    return action.themeData;
  default:
    return state;
  }
};

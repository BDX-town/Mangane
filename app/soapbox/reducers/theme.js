import {
  SET_THEME,
} from '../actions/theme';
import { Map as ImmutableMap } from 'immutable';
import { brightness, hue } from 'chromatism';

const initialState = ImmutableMap();

const populate = themeData => {
  const { 'brand-color': brandColor } = themeData.toObject();
  return ImmutableMap({
    'nav-ui-highlight-color': brightness(10, hue(-3, brandColor).hex).hex,
  }).merge(themeData);
};

export default function theme(state = initialState, action) {
  switch(action.type) {
  case SET_THEME:
    return populate(ImmutableMap(action.themeData));
  default:
    return state;
  }
};

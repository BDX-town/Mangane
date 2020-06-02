import {
  THEME_SET,
  THEME_GENERATE,
} from '../actions/theme';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap();

const hex2rgb = c => c.substr(1).match(/../g).map(x => + `0x${x}`);

export const generateTheme = (brandColor, mode = 'light') => {
  if (!brandColor) return false;
  const [ r, g, b ] = hex2rgb(brandColor);
  return ImmutableMap({
    'brand-color-r': r,
    'brand-color-g': g,
    'brand-color-b': b,
  });
};

export const setTheme = themeData => {
  const { 'brand-color': brandColor } = themeData.toObject();
  return ImmutableMap(generateTheme(brandColor, 'light')).merge(themeData);
};

export default function theme(state = initialState, action) {
  switch(action.type) {
  case THEME_GENERATE:
    return generateTheme(action.brandColor, action.mode);
  case THEME_SET:
    return setTheme(ImmutableMap(action.brandColor));
  default:
    return state;
  }
};

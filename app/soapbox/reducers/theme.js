import {
  THEME_SET,
  THEME_GENERATE,
} from '../actions/theme';
import { Map as ImmutableMap } from 'immutable';
import { brightness, hue, convert } from 'chromatism';

const initialState = ImmutableMap();

const cssrgba = (color, a) => {
  const { r, g, b } = convert(color).rgb;
  return `rgba(${[r, g, b, a].join(',')})`;
};

const makeContrast = (percent, color, mode) => {
  percent = mode === 'light' ? -percent : percent;
  return brightness(percent, color);
};

export const generateTheme = (brandColor, mode) => {
  return ImmutableMap({
    'brand-color': brandColor,
    'accent-color': brightness(10, hue(-3, brandColor).hex).hex,
    'brand-color-faint': cssrgba(brandColor, 0.1),
    'brand-color-med': cssrgba(brandColor, 0.2),
    'highlight-text-color': makeContrast(5, brandColor, mode).hex,
    'brand-color-hicontrast': makeContrast(15, brandColor, mode).hex,
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

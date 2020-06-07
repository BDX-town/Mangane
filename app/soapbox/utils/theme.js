import { Map as ImmutableMap } from 'immutable';
import hexToHsl from 'hex-to-hsl';

export const generateThemeCss = brandColor => {
  if (!brandColor) return null;
  return themeDataToCss(brandColorToThemeData(brandColor));
};

export const brandColorToThemeData = brandColor => {
  const [ h, s, l ] = hexToHsl(brandColor);
  return ImmutableMap({
    'brand-color_h': h,
    'brand-color_s': `${s}%`,
    'brand-color_l': `${l}%`,
  });
};

export const themeDataToCss = themeData => (
  themeData
    .entrySeq()
    .reduce((acc, cur) => acc + `--${cur[0]}:${cur[1]};`, '')
);

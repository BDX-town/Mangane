import { Map as ImmutableMap } from 'immutable';
import { convert } from 'chromatism';

export const generateThemeCss = brandColor => {
  if (!brandColor) return null;
  return themeDataToCss(brandColorToThemeData(brandColor));
};

export const brandColorToThemeData = brandColor => {
  const { h, s, l } = convert(brandColor).hsl;
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

import { Map as ImmutableMap } from 'immutable';

const hex2rgb = c => c.substr(1).match(/../g).map(x => + `0x${x}`);

export const generateThemeCss = brandColor => {
  if (!brandColor) return null;
  return themeDataToCss(brandColorToThemeData(brandColor));
};

export const brandColorToThemeData = brandColor => {
  const [ r, g, b ] = hex2rgb(brandColor);
  return ImmutableMap({
    'brand-color-r': r,
    'brand-color-g': g,
    'brand-color-b': b,
  });
};

export const themeDataToCss = themeData => (
  themeData
    .entrySeq()
    .reduce((acc, cur) => acc + `--${cur[0]}:${cur[1]};`, '')
);

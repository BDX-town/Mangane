import { Map as ImmutableMap, fromJS } from 'immutable';

import tintify from 'soapbox/utils/colors';

import type { TailwindColorPalette } from 'soapbox/types/colors';

type SoapboxConfig = ImmutableMap<string, any>;
type SoapboxColors = ImmutableMap<string, any>;

/** Check if the value is a valid hex color */
const isHex = (value: any): boolean => /^#([0-9A-F]{3}){1,2}$/i.test(value);

/** Expand hex colors into tints */
export const expandPalette = (palette: TailwindColorPalette): TailwindColorPalette => {
  // Generate palette only for present colors
  return Object.entries(palette).reduce((result: TailwindColorPalette, colorData) => {
    const [colorName, color] = colorData;

    // Conditionally handle hex color and Tailwind color object
    if (typeof color === 'string' && isHex(color)) {
      result[colorName] = tintify(color);
    } else if (typeof color === 'object') {
      result[colorName] = color;
    }

    return result;
  }, {});
};

/** Build a color object from legacy colors */
export const fromLegacyColors = (soapboxConfig: SoapboxConfig): TailwindColorPalette => {
  return expandPalette({
    primary: soapboxConfig.get('brandColor'),
    accent: soapboxConfig.get('accentColor'),
  });
};

/** Convert Soapbox Config into Tailwind colors */
export const toTailwind = (soapboxConfig: SoapboxConfig): SoapboxColors => {
  const colors: SoapboxColors = ImmutableMap(soapboxConfig.get('colors'));
  const legacyColors: SoapboxColors = ImmutableMap(fromJS(fromLegacyColors(soapboxConfig)));

  return legacyColors.mergeDeep(colors);
};

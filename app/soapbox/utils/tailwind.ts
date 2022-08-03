import { Map as ImmutableMap, fromJS } from 'immutable';

import tintify from 'soapbox/utils/colors';
import { generateAccent, generateNeutral } from 'soapbox/utils/theme';

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
    } else if (color && typeof color === 'object') {
      result[colorName] = color;
    }

    return result;
  }, {});
};

// Generate accent color only if brandColor is present
const maybeGenerateAccentColor = (brandColor: any): string | null => {
  return isHex(brandColor) ? generateAccent(brandColor) : null;
};

/** Build a color object from legacy colors */
export const fromLegacyColors = (soapboxConfig: SoapboxConfig): TailwindColorPalette => {
  const brandColor = soapboxConfig.get('brandColor');
  const accentColor = soapboxConfig.get('accentColor');
  const accent = isHex(accentColor) ? accentColor : maybeGenerateAccentColor(brandColor);

  return expandPalette({
    primary: isHex(brandColor) ? brandColor : null,
    secondary: accent,
    accent,
    gray: (isHex(brandColor) ? generateNeutral(brandColor) : null) as any,
  });
};

/** Convert Soapbox Config into Tailwind colors */
export const toTailwind = (soapboxConfig: SoapboxConfig): SoapboxConfig => {
  const colors: SoapboxColors = ImmutableMap(soapboxConfig.get('colors'));
  const legacyColors: SoapboxColors = ImmutableMap(fromJS(fromLegacyColors(soapboxConfig)));

  return soapboxConfig.set('colors', legacyColors.mergeDeep(colors));
};

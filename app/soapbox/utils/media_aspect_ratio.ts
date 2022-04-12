export const minimumAspectRatio = 9 / 16; // Portrait phone
export const maximumAspectRatio = 10; // Generous min-height

export const isPanoramic = (ar: number) => {
  if (isNaN(ar)) return false;
  return ar >= maximumAspectRatio;
};

export const isPortrait = (ar: number) => {
  if (isNaN(ar)) return false;
  return ar <= minimumAspectRatio;
};

export const isNonConformingRatio = (ar: number) => {
  if (isNaN(ar)) return false;
  return !isPanoramic(ar) && !isPortrait(ar);
};

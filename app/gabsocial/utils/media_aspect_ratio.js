export const minimumAspectRatio = .8;
export const maximumAspectRatio = 2.8;

export const isPanoramic = ar => {
  if (isNaN(ar)) return false;
  return ar >= maximumAspectRatio;
}

export const isPortrait = ar => {
  if (isNaN(ar)) return false;
  return ar <= minimumAspectRatio;
}

export const isNonConformingRatio = ar => {
  if (isNaN(ar)) return false;
  return !isPanoramic(ar) && !isPortrait(ar);
}

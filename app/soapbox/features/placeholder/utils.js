export const PLACEHOLDER_CHAR = '█';

export const generateText = length => {
  let text = '';

  for (let i = 0; i < length; i++) {
    text += PLACEHOLDER_CHAR;
  }

  return text;
};

// https://stackoverflow.com/a/7228322/8811886
export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// For getting the icon
export const getCoinIcon = ticker => {
  return require(`cryptocurrency-icons/svg/color/${ticker.toLowerCase()}.svg`);
};

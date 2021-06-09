const icons = {};

function importAll(r) {
  const pathRegex = /\.\/(.*)\.svg/i;

  r.keys().forEach((key) => {
    const ticker = pathRegex.exec(key)[1];
    return icons[ticker] = r(key).default;
  });
}

importAll(require.context('cryptocurrency-icons/svg/color/', true, /\.svg$/));

const getCoinIcon = ticker => icons[ticker] || icons.generic || null;

module.exports = {
  default: icons,
  getCoinIcon,
};

// Does some trickery to import all the icons into the project
// See: https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack

const icons = {};

function importAll(r) {
  const pathRegex = /\.\/(.*)\.svg/i;

  r.keys().forEach((key) => {
    const ticker = pathRegex.exec(key)[1];
    return icons[ticker] = r(key).default;
  });
}

importAll(require.context('cryptocurrency-icons/svg/color/', true, /\.svg$/));

export default icons;

// For getting the icon
export const getCoinIcon = ticker => icons[ticker] || icons.generic || null;

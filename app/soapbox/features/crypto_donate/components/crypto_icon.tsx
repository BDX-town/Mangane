import React from 'react';

/** Get crypto icon URL by ticker symbol, or fall back to generic icon */
const getIcon = (ticker: string): string => {
  try {
    return require(`cryptocurrency-icons/svg/color/${ticker.toLowerCase()}.svg`);
  } catch {
    return require('cryptocurrency-icons/svg/color/generic.svg');
  }
};

interface ICryptoIcon {
  ticker: string,
  title?: string,
  className?: string,
}

const CryptoIcon: React.FC<ICryptoIcon> = ({ ticker, title, className }): JSX.Element => {
  return (
    <div className={className}>
      <img
        src={getIcon(ticker)}
        alt={title || ticker}
      />
    </div>
  );
};

export default CryptoIcon;

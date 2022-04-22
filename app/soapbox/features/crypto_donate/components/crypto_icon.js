import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const getIcon = ticker => {
  try {
    return require(`cryptocurrency-icons/svg/color/${ticker.toLowerCase()}.svg`);
  } catch {
    return require('cryptocurrency-icons/svg/color/generic.svg');
  }
};

export default class CryptoIcon extends React.PureComponent {

  static propTypes = {
    ticker: PropTypes.string.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
  }

  render() {
    const { ticker, title, className } = this.props;

    return (
      <div className={classNames('crypto-icon', className)}>
        <img
          src={getIcon(ticker)}
          alt={title || ticker}
        />
      </div>
    );
  }

}

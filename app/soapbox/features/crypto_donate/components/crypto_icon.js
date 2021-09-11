import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
          src={require(`cryptocurrency-icons/svg/color/${ticker.toLowerCase()}.svg`)}
          alt={title || ticker}
        />
      </div>
    );
  }

}

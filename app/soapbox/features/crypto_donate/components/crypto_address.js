import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import CoinDB from '../utils/coin_db';
import { getCoinIcon } from '../utils/coin_icons';

export default class CryptoAddress extends ImmutablePureComponent {

  static propTypes = {
    address: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    note: PropTypes.string,
  }

  setInputRef = c => {
    this.input = c;
  }

  handleCopyClick = e => {
    if (!this.input) return;

    this.input.select();
    this.input.setSelectionRange(0, 99999);

    document.execCommand('copy');
  }

  render() {
    const { address, ticker, note } = this.props;
    const title = CoinDB.getIn([ticker, 'name']);

    return (
      <div className='crypto-address'>
        <div className='crypto-address__head'>
          <div className='crypto-address__icon'>
            <img src={getCoinIcon(ticker)} alt={title} />
          </div>
          <div className='crypto-address__title'>{title}</div>
        </div>
        {note && <div className='crypto-address__note'>{note}</div>}
        <div className='crypto-address__address'>
          <input ref={this.setInputRef} type='text' value={address} />
          <button className='crypto-address__copy' onClick={this.handleCopyClick}>
            <FormattedMessage id='crypto_donate.copy' defaultMessage='Copy' />
          </button>
        </div>
      </div>
    );
  }

}

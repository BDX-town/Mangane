import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import QRCode from 'qrcode.react';
import CoinDB from '../utils/coin_db';
import { getCoinIcon } from '../utils/coin_icons';

export default class CryptoAddress extends ImmutablePureComponent {

  static propTypes = {
    address: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    note: PropTypes.string,
  }

  render() {
    const { address, ticker, note } = this.props;
    const title = CoinDB.getIn([ticker, 'name']);

    return (
      <div className='crypto-address'>
        <div className='crypto-address__icon'>
          <img src={getCoinIcon(ticker)} alt={title} />
        </div>
        <div className='crypto-address__qr-code'>
          <QRCode value={address} />
        </div>
        <div className='crypto-address__title'>{title}</div>
        <div className='crypto-address__address'>{address}</div>
        {note && <div className='crypto-address__note'>{note}</div>}
      </div>
    );
  }

}

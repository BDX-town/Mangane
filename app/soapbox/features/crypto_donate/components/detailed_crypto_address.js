import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from 'soapbox/components/icon';
import QRCode from 'qrcode.react';
import CoinDB from '../utils/coin_db';
import CryptoIcon from './crypto_icon';
import { CopyableInput } from 'soapbox/features/forms';
import { getExplorerUrl } from '../utils/block_explorer';

export default class DetailedCryptoAddress extends ImmutablePureComponent {

  static propTypes = {
    address: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    note: PropTypes.string,
  }

  render() {
    const { address, ticker, note } = this.props;
    const title = CoinDB.getIn([ticker, 'name']);
    const explorerUrl = getExplorerUrl(ticker, address);

    return (
      <div className='crypto-address'>
        <div className='crypto-address__head'>
          <CryptoIcon
            className='crypto-address__icon'
            ticker={ticker}
            title={title}
          />
          <div className='crypto-address__title'>{title || ticker.toUpperCase()}</div>
          <div className='crypto-address__actions'>
            {explorerUrl && <a href={explorerUrl} target='_blank'>
              <Icon id='external-link' />
            </a>}
          </div>
        </div>
        {note && <div className='crypto-address__note'>{note}</div>}
        <div className='crypto-address__qrcode'>
          <QRCode value={address} />
        </div>
        <div className='crypto-address__address simple_form'>
          <CopyableInput value={address} />
        </div>
      </div>
    );
  }

}

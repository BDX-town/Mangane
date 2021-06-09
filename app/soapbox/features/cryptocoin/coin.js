import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import QRCode from 'qrcode.react';
import { getCoinIcon } from './icons';

export default class Coin extends ImmutablePureComponent {

  static propTypes = {
    coin: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { coin } = this.props;

    return (
      <div className='coin'>
        <div className='coin__icon'>
          <img src={getCoinIcon(coin.get('ticker'))} alt={coin.get('title')} />
        </div>
        <div className='coin__qr-code'>
          <QRCode value={coin.get('address')} />
        </div>
        <div className='coin__title'>{coin.get('title')}</div>
        <div className='coin__address'>{coin.get('address')}</div>
      </div>
    );
  }

}

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from 'soapbox/components/icon';
import CoinDB from '../utils/coin_db';
import CryptoIcon from './crypto_icon';
import { openModal } from 'soapbox/actions/modal';
import { CopyableInput } from 'soapbox/features/forms';
import { getExplorerUrl } from '../utils/block_explorer';

export default @connect()
class CryptoAddress extends ImmutablePureComponent {

  static propTypes = {
    address: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    note: PropTypes.string,
  }

  handleModalClick = e => {
    this.props.dispatch(openModal('CRYPTO_DONATE', this.props));
    e.preventDefault();
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
            <a href='' onClick={this.handleModalClick}>
              <Icon id='qrcode' />
            </a>
            {explorerUrl && <a href={explorerUrl} target='_blank'>
              <Icon id='external-link' />
            </a>}
          </div>
        </div>
        {note && <div className='crypto-address__note'>{note}</div>}
        <div className='crypto-address__address simple_form'>
          <CopyableInput value={address} />
        </div>
      </div>
    );
  }

}

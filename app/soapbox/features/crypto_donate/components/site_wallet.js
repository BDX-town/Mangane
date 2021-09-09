import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import CryptoAddress from './crypto_address';
import { createSelector } from 'reselect';
import { trimStart } from 'lodash';

const normalizeAddress = address => {
  return address.update('ticker', '', ticker => {
    return trimStart(ticker, '$').toLowerCase();
  });
};

const normalizeAddresses = addresses => addresses.map(normalizeAddress);

const makeGetCoinList = () => {
  return createSelector(
    [(addresses, limit) => typeof limit === 'number' ? addresses.take(limit) : addresses],
    addresses => normalizeAddresses(addresses),
  );
};

const makeMapStateToProps = () => {
  const getCoinList = makeGetCoinList();

  const mapStateToProps = (state, ownProps) => {
    // Address example:
    // {"ticker": "btc", "address": "bc1q9cx35adpm73aq2fw40ye6ts8hfxqzjr5unwg0n", "note": "This is our main address"}
    const addresses = state.getIn(['soapbox', 'cryptoAddresses']);
    const { limit } = ownProps;

    return {
      coinList: getCoinList(addresses, limit),
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
class CoinList extends ImmutablePureComponent {

  static propTypes = {
    coinList: ImmutablePropTypes.list,
    limit: PropTypes.number,
  }

  render() {
    const { coinList } = this.props;
    if (!coinList) return null;

    return (
      <div className='site-wallet'>
        {coinList.map(coin => (
          <CryptoAddress
            key={coin.get('ticker')}
            {...coin.toJS()}
          />
        ))}
      </div>
    );
  }

}

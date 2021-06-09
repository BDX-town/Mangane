import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import CryptoAddress from './crypto_address';

const mapStateToProps = state => {
  // Address example:
  // {"ticker": "btc", "address": "bc1q9cx35adpm73aq2fw40ye6ts8hfxqzjr5unwg0n", "note": "This is our main address"}
  return {
    coinList: state.getIn(['soapbox', 'crypto_addresses']),
  };
};

export default @connect(mapStateToProps)
class CoinList extends ImmutablePureComponent {

  static propTypes = {
    coinList: ImmutablePropTypes.list,
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

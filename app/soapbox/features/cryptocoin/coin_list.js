import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { List as ImmutableList, fromJS } from 'immutable';
import coinDB from './coin_db.json';
import Coin from './coin';

const supportedCoins = ImmutableList(coinDB.supportedCoins);
const coinData = fromJS(coinDB.coinData);

const makeCoinList = crypto => {
  return supportedCoins.reduce((acc, ticker) => {
    const address = crypto.get(ticker);
    const data = coinData.get(ticker);
    if (!address || !data) return acc;

    const coin = data.merge({ ticker, address });

    return acc.push(coin);
  }, ImmutableList());
};

const mapStateToProps = state => {
  const crypto = state.getIn(['soapbox', 'cryptocoin']);

  return {
    coinList: makeCoinList(crypto),
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
      <div className='crypto'>
        {coinList.map(coin => (
          <Coin coin={coin} key={coin.get('ticker')} />
        ))}
      </div>
    );
  }

}

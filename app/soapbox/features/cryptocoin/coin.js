import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

export default class Coin extends ImmutablePureComponent {

  static propTypes = {
    coin: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { coin } = this.props;

    return (
      <div className='cryptocoin__coin'>
        {coin.get('title')}
        {coin.get('address')}
      </div>
    );
  }

}

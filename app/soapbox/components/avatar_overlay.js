import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import StillImage from 'soapbox/components/still_image';

export default class AvatarOverlay extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.record.isRequired,
    friend: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { account, friend } = this.props;

    return (
      <div className='account__avatar-overlay'>
        <StillImage src={account.get('avatar')} className='account__avatar-overlay-base' />
        <StillImage src={friend.get('avatar')} className='account__avatar-overlay-overlay' />
      </div>
    );
  }

}

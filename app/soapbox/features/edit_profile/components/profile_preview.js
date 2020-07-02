import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { acctFull } from 'soapbox/utils/accounts';
import StillImage from 'soapbox/components/still_image';

const ProfilePreview = ({ account }) => (
  <div className='card h-card'>
    <a target='_blank' rel='noopener' href={account.get('url')}>
      <div className='card__img'>
        <StillImage alt='' src={account.get('header')} />
      </div>
      <div className='card__bar'>
        <div className='avatar'>
          <StillImage alt='' className='u-photo' src={account.get('avatar')} width='48' height='48' />
        </div>
        <div className='display-name'>
          <span style={{ display: 'none' }}>{account.get('username')}</span>
          <bdi>
            <strong className='emojify p-name'>{account.get('display_name')}</strong>
          </bdi>
          <span>{acctFull(account)}</span>
        </div>
      </div>
    </a>
  </div>
);

ProfilePreview.propTypes = {
  account: ImmutablePropTypes.map,
};

export default ProfilePreview;

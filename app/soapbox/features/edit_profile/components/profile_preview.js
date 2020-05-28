import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { acctFull } from 'soapbox/utils/accounts';

const ProfilePreview = ({ account }) => (
  <div className='card h-card'>
    <a target='_blank' rel='noopener' href={account.get('url')}>
      <div className='card__img'>
        <img alt='' src={account.get('header')} />
      </div>
      <div className='card__bar'>
        <div className='avatar'>
          <img alt='' className='u-photo' src={account.get('avatar')} width='48' height='48' />
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

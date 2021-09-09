import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { getAcct } from 'soapbox/utils/accounts';
import StillImage from 'soapbox/components/still_image';
import VerificationBadge from 'soapbox/components/verification_badge';
import { List as ImmutableList } from 'immutable';
import { displayFqn } from 'soapbox/utils/state';

const mapStateToProps = state => ({
  displayFqn: displayFqn(state),
});

const ProfilePreview = ({ account, displayFqn }) => (
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
            <strong className='emojify p-name'>
              {account.get('display_name')}
              {account.getIn(['pleroma', 'tags'], ImmutableList()).includes('verified') && <VerificationBadge />}
            </strong>
          </bdi>
          <span>@{getAcct(account, displayFqn)}</span>
        </div>
      </div>
    </a>
  </div>
);

ProfilePreview.propTypes = {
  account: ImmutablePropTypes.map,
  displayFqn: PropTypes.bool,
};

export default connect(mapStateToProps)(ProfilePreview);

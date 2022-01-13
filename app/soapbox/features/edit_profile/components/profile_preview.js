import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import StillImage from 'soapbox/components/still_image';
import VerificationBadge from 'soapbox/components/verification_badge';
import { getAcct, isVerified } from 'soapbox/utils/accounts';
import { displayFqn } from 'soapbox/utils/state';

const mapStateToProps = state => ({
  displayFqn: displayFqn(state),
});

const ProfilePreview = ({ account, displayFqn }) => (
  <div className='card h-card'>
    <Link to={`/@${account.get('acct')}`}>
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
              {isVerified(account) && <VerificationBadge />}
            </strong>
          </bdi>
          <span>@{getAcct(account, displayFqn)}</span>
        </div>
      </div>
    </Link>
  </div>
);

ProfilePreview.propTypes = {
  account: ImmutablePropTypes.map,
  displayFqn: PropTypes.bool,
};

export default connect(mapStateToProps)(ProfilePreview);

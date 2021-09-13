import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { NavLink } from 'react-router-dom';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
});

export default @injectIntl
class ProfileStats extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { intl } = this.props;
    const { account } = this.props;

    if (!account) {
      return null;
    }

    const acct = account.get('acct');

    return (
      <div className='profile-stats'>
        <NavLink className='profile-stat' to={`/@${acct}/followers`} onClick={this.handleClose} title={intl.formatNumber(account.get('followers_count'))}>
          <strong className='profile-stat__value'>
            {shortNumberFormat(account.get('followers_count'))}
          </strong>
          <span className='profile-stat__label'>
            {intl.formatMessage(messages.followers)}
          </span>
        </NavLink>

        <NavLink className='profile-stat' to={`/@${acct}/following`} onClick={this.handleClose} title={intl.formatNumber(account.get('following_count'))}>
          <strong className='profile-stat__value'>
            {shortNumberFormat(account.get('following_count'))}
          </strong>
          <span className='profile-stat__label'>
            {intl.formatMessage(messages.follows)}
          </span>
        </NavLink>
      </div>
    );
  }

}

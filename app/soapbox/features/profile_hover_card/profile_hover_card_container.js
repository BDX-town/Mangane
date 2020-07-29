import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeGetAccount } from '../../selectors';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import UserPanel from '../ui/components/user_panel';
import ActionButton from '../ui/components/action_button';
import { isAdmin, isModerator } from 'soapbox/utils/accounts';
import Badge from 'soapbox/components/badge';

const getAccount = makeGetAccount();

const mapStateToProps = (state, { accountId }) => {
  return {
    account: getAccount(state, accountId),
  };
};

const mapDispatchToProps = (dispatch) => ({

});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ProfileHoverCardContainer extends ImmutablePureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    accountId: PropTypes.string,
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: true,
  }

  render() {
    const { visible, accountId, account } = this.props;
    if (!accountId) return null;
    const accountBio = { __html: account.get('note_emojified') };
    let followed_by  = account.getIn(['relationship', 'followed_by']);

    return visible && (
      <div className='profile-hover-card'>
        <div className='profile-hover-card__container'>
          <div className='profile-hover-card__action-button'><ActionButton account={account} /></div>
          <UserPanel className='profile-hover-card__user' accountId={accountId} />
          <div className='profile-hover-card__badges'>
            {isAdmin(account) && <Badge slug='admin' title='Admin' />}
            {isModerator(account) && <Badge slug='moderator' title='Moderator' />}
            {account.getIn(['patron', 'is_patron']) && <Badge slug='patron' title='Patron' />}
            { followed_by ?
              <span className='relationship-tag'>
                <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
              </span>
              : '' }
          </div>
          <div className='profile-hover-card__bio' dangerouslySetInnerHTML={accountBio} />
        </div>
      </div>
    );
  }

};

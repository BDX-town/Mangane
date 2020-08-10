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
import classNames from 'classnames';
import { fetchRelationships } from 'soapbox/actions/accounts';

const getAccount = makeGetAccount();

const mapStateToProps = (state, { accountId }) => {
  return {
    account: getAccount(state, accountId),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ProfileHoverCardContainer extends ImmutablePureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    accountId: PropTypes.string,
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: true,
  }

  getBadges = () => {
    const { account } = this.props;
    let badges = [];
    if (isAdmin(account)) badges.push(<Badge key='admin' slug='admin' title='Admin' />);
    if (isModerator(account)) badges.push(<Badge key='moderator' slug='moderator' title='Moderator' />);
    if (account.getIn(['patron', 'is_patron'])) badges.push(<Badge key='patron' slug='patron' title='Patron' />);
    return badges;
  }

  componentDidMount() {
    this.props.dispatch(fetchRelationships([this.props.accountId]));
  }

  render() {
    const { visible, accountId, account } = this.props;
    if (!accountId) return null;
    const accountBio = { __html: account.get('note_emojified') };
    const followedBy  = account.getIn(['relationship', 'followed_by']);
    const badges = this.getBadges();

    return (
      <div className={classNames('profile-hover-card', { 'profile-hover-card--visible': visible })}>
        <div className='profile-hover-card__container'>
          {followedBy &&
            <span className='relationship-tag'>
              <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
            </span>}
          <div className='profile-hover-card__action-button'><ActionButton account={account} small /></div>
          <UserPanel className='profile-hover-card__user' accountId={accountId} />
          {badges.length > 0 &&
            <div className='profile-hover-card__badges'>
              {badges}
            </div>}
          {account.getIn(['source', 'note'], '').length > 0 &&
            <div className='profile-hover-card__bio' dangerouslySetInnerHTML={accountBio} />}
        </div>
      </div>
    );
  }

};

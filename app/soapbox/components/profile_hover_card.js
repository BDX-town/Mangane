import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeGetAccount } from 'soapbox/selectors';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import UserPanel from 'soapbox/features/ui/components/user_panel';
import ActionButton from 'soapbox/features/ui/components/action_button';
import { isAdmin, isModerator } from 'soapbox/utils/accounts';
import Badge from 'soapbox/components/badge';
import classNames from 'classnames';
import { fetchRelationships } from 'soapbox/actions/accounts';
import { usePopper } from 'react-popper';
import {
  closeProfileHoverCard,
  updateProfileHoverCard,
} from 'soapbox/actions/profile_hover_card';

const getAccount = makeGetAccount();

const getBadges = (account) => {
  const badges = [];

  if (isAdmin(account)) {
    badges.push(<Badge key='admin' slug='admin' title='Admin' />);
  } else if (isModerator(account)) {
    badges.push(<Badge key='moderator' slug='moderator' title='Moderator' />);
  }

  if (account.getIn(['patron', 'is_patron'])) {
    badges.push(<Badge key='patron' slug='patron' title='Patron' />);
  }

  return badges;
};

const handleMouseEnter = (dispatch) => {
  return e => {
    dispatch(updateProfileHoverCard());
  };
};

const handleMouseLeave = (dispatch) => {
  return e => {
    dispatch(closeProfileHoverCard(true));
  };
};

export const ProfileHoverCard = ({ visible }) => {
  const dispatch = useDispatch();

  const [popperElement, setPopperElement] = useState(null);

  const accountId = useSelector(state => state.getIn(['profile_hover_card', 'accountId']));
  const account   = useSelector(state => accountId && getAccount(state, accountId));
  const targetRef = useSelector(state => state.getIn(['profile_hover_card', 'ref', 'current']));
  const badges = account ? getBadges(account) : [];

  useEffect(() => {
    if (accountId) dispatch(fetchRelationships([accountId]));
  }, [dispatch, accountId]);

  const { styles, attributes } = usePopper(targetRef, popperElement);

  if (!account) return null;
  const accountBio = { __html: account.get('note_emojified') };
  const followedBy  = account.getIn(['relationship', 'followed_by']);

  return (
    <div className={classNames('profile-hover-card', { 'profile-hover-card--visible': visible })} ref={setPopperElement} style={styles.popper} {...attributes.popper} onMouseEnter={handleMouseEnter(dispatch)} onMouseLeave={handleMouseLeave(dispatch)}>
      <div className='profile-hover-card__container'>
        {followedBy &&
          <span className='relationship-tag'>
            <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
          </span>}
        <div className='profile-hover-card__action-button'><ActionButton account={account} small /></div>
        <UserPanel className='profile-hover-card__user' accountId={account.get('id')} />
        {badges.length > 0 &&
          <div className='profile-hover-card__badges'>
            {badges}
          </div>}
        {account.getIn(['source', 'note'], '').length > 0 &&
          <div className='profile-hover-card__bio' dangerouslySetInnerHTML={accountBio} />}
      </div>
    </div>
  );
};

ProfileHoverCard.propTypes = {
  visible: PropTypes.bool,
  accountId: PropTypes.string,
  account: ImmutablePropTypes.map,
  intl: PropTypes.object.isRequired,
};

ProfileHoverCard.defaultProps = {
  visible: true,
};

export default injectIntl(ProfileHoverCard);

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Icon from 'soapbox/components/icon';
import Button from 'soapbox/components/button';
import ImmutablePureComponent from 'react-immutable-pure-component';
import {
  isStaff,
  isAdmin,
  isModerator,
  isVerified,
  isLocal,
  isRemote,
  getDomain,
} from 'soapbox/utils/accounts';
import classNames from 'classnames';
import Avatar from 'soapbox/components/avatar';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import { NavLink } from 'react-router-dom';
import DropdownMenuContainer from 'soapbox/containers/dropdown_menu_container';
import ProfileInfoPanel from '../../ui/components/profile_info_panel';
import { debounce } from 'lodash';
import StillImage from 'soapbox/components/still_image';
import ActionButton from 'soapbox/features/ui/components/action_button';
import SubscriptionButton from 'soapbox/features/ui/components/subscription_button';
import { openModal } from 'soapbox/actions/modal';
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention' },
  direct: { id: 'account.direct', defaultMessage: 'Direct message @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  report: { id: 'account.report', defaultMessage: 'Report @{name}' },
  share: { id: 'account.share', defaultMessage: 'Share @{name}\'s profile' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  blockDomain: { id: 'account.block_domain', defaultMessage: 'Hide everything from {domain}' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
  hideReblogs: { id: 'account.hide_reblogs', defaultMessage: 'Hide reposts from @{name}' },
  showReblogs: { id: 'account.show_reblogs', defaultMessage: 'Show reposts from @{name}' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  endorse: { id: 'account.endorse', defaultMessage: 'Feature on profile' },
  unendorse: { id: 'account.unendorse', defaultMessage: 'Don\'t feature on profile' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  deactivateUser: { id: 'admin.users.actions.deactivate_user', defaultMessage: 'Deactivate @{name}' },
  deleteUser: { id: 'admin.users.actions.delete_user', defaultMessage: 'Delete @{name}' },
  verifyUser: { id: 'admin.users.actions.verify_user', defaultMessage: 'Verify @{name}' },
  unverifyUser: { id: 'admin.users.actions.unverify_user', defaultMessage: 'Unverify @{name}' },
  promoteToAdmin: { id: 'admin.users.actions.promote_to_admin', defaultMessage: 'Promote @{name} to an admin' },
  promoteToModerator: { id: 'admin.users.actions.promote_to_moderator', defaultMessage: 'Promote @{name} to a moderator' },
  demoteToModerator: { id: 'admin.users.actions.demote_to_moderator', defaultMessage: 'Demote @{name} to a moderator' },
  demoteToUser: { id: 'admin.users.actions.demote_to_user', defaultMessage: 'Demote @{name} to a regular user' },
  subscribe: { id: 'account.subscribe', defaultMessage: 'Subscribe to notifications from @{name}' },
  unsubscribe: { id: 'account.unsubscribe', defaultMessage: 'Unsubscribe to notifications from @{name}' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    me,
    meAccount: account,
    features,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Header extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    meAccount: ImmutablePropTypes.map,
    identity_props: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
    username: PropTypes.string,
    features: PropTypes.object,
  };

  state = {
    isSmallScreen: (window.innerWidth <= 895),
  }

  isStatusesPageActive = (match, location) => {
    if (!match) {
      return false;
    }

    return !location.pathname.match(/\/(followers|following|favorites|pins)\/?$/);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = debounce(() => {
    this.setState({ isSmallScreen: (window.innerWidth <= 895) });
  }, 5, {
    trailing: true,
  });

  onAvatarClick = () => {
    const avatar_url = this.props.account.get('avatar');
    const avatar = ImmutableMap({
      type: 'image',
      preview_url: avatar_url,
      url: avatar_url,
      description: '',
    });
    this.props.dispatch(openModal('MEDIA', { media: ImmutableList.of(avatar), index: 0 }));
  }

  handleAvatarClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.onAvatarClick();
    }
  }

  onHeaderClick = () => {
    const header_url = this.props.account.get('header');
    const header = ImmutableMap({
      type: 'image',
      preview_url: header_url,
      url: header_url,
      description: '',
    });
    this.props.dispatch(openModal('MEDIA', { media: ImmutableList.of(header), index: 0 }));
  }

  handleHeaderClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.onHeaderClick();
    }
  }

  makeMenu() {
    const { account, intl, me, meAccount, features } = this.props;

    const menu = [];

    if (!account || !me) {
      return [];
    }

    if ('share' in navigator) {
      menu.push({ text: intl.formatMessage(messages.share, { name: account.get('username') }), action: this.handleShare });
      menu.push(null);
    }

    if (account.get('id') === me) {
      menu.push({ text: intl.formatMessage(messages.edit_profile), to: '/settings/profile' });
      menu.push({ text: intl.formatMessage(messages.preferences), to: '/settings/preferences' });
      menu.push(null);
      menu.push({ text: intl.formatMessage(messages.follow_requests), to: '/follow_requests' });
      menu.push(null);
      menu.push({ text: intl.formatMessage(messages.mutes), to: '/mutes' });
      menu.push({ text: intl.formatMessage(messages.blocks), to: '/blocks' });
      menu.push({ text: intl.formatMessage(messages.domain_blocks), to: '/domain_blocks' });
    } else {
      menu.push({ text: intl.formatMessage(messages.mention, { name: account.get('username') }), action: this.props.onMention });
      if (account.getIn(['relationship', 'following'])) {
        if (account.getIn(['relationship', 'showing_reblogs'])) {
          menu.push({ text: intl.formatMessage(messages.hideReblogs, { name: account.get('username') }), action: this.props.onReblogToggle });
        } else {
          menu.push({ text: intl.formatMessage(messages.showReblogs, { name: account.get('username') }), action: this.props.onReblogToggle });
        }

        if (account.getIn(['relationship', 'subscribing'])) {
          menu.push({ text: intl.formatMessage(messages.unsubscribe, { name: account.get('username') }), action: this.props.onSubscriptionToggle });
        } else {
          menu.push({ text: intl.formatMessage(messages.subscribe, { name: account.get('username') }), action: this.props.onSubscriptionToggle });
        }

        menu.push({ text: intl.formatMessage(messages.add_or_remove_from_list), action: this.props.onAddToList });
        // menu.push({ text: intl.formatMessage(account.getIn(['relationship', 'endorsed']) ? messages.unendorse : messages.endorse), action: this.props.onEndorseToggle });
        menu.push(null);
      } else if (features.unrestrictedLists) {
        menu.push({ text: intl.formatMessage(messages.add_or_remove_from_list), action: this.props.onAddToList });
      }

      if (account.getIn(['relationship', 'muting'])) {
        menu.push({ text: intl.formatMessage(messages.unmute, { name: account.get('username') }), action: this.props.onMute });
      } else {
        menu.push({ text: intl.formatMessage(messages.mute, { name: account.get('username') }), action: this.props.onMute });
      }

      if (account.getIn(['relationship', 'blocking'])) {
        menu.push({ text: intl.formatMessage(messages.unblock, { name: account.get('username') }), action: this.props.onBlock });
      } else {
        menu.push({ text: intl.formatMessage(messages.block, { name: account.get('username') }), action: this.props.onBlock });
      }

      menu.push({ text: intl.formatMessage(messages.report, { name: account.get('username') }), action: this.props.onReport });
    }

    if (isRemote(account)) {
      const domain = getDomain(account);

      menu.push(null);

      if (account.getIn(['relationship', 'domain_blocking'])) {
        menu.push({ text: intl.formatMessage(messages.unblockDomain, { domain }), action: this.props.onUnblockDomain });
      } else {
        menu.push({ text: intl.formatMessage(messages.blockDomain, { domain }), action: this.props.onBlockDomain });
      }
    }

    if (isStaff(meAccount)) {
      menu.push(null);

      if (isAdmin(meAccount)) {
        menu.push({ text: intl.formatMessage(messages.admin_account, { name: account.get('username') }), href: `/pleroma/admin/#/users/${account.get('id')}/`, newTab: true });
      }

      if (account.get('id') !== me && isLocal(account)) {
        if (isAdmin(account)) {
          menu.push({ text: intl.formatMessage(messages.demoteToModerator, { name: account.get('username') }), action: this.props.onPromoteToModerator });
          menu.push({ text: intl.formatMessage(messages.demoteToUser, { name: account.get('username') }), action: this.props.onDemoteToUser });
        } else if (isModerator(account)) {
          menu.push({ text: intl.formatMessage(messages.promoteToAdmin, { name: account.get('username') }), action: this.props.onPromoteToAdmin });
          menu.push({ text: intl.formatMessage(messages.demoteToUser, { name: account.get('username') }), action: this.props.onDemoteToUser });
        } else {
          menu.push({ text: intl.formatMessage(messages.promoteToAdmin, { name: account.get('username') }), action: this.props.onPromoteToAdmin });
          menu.push({ text: intl.formatMessage(messages.promoteToModerator, { name: account.get('username') }), action: this.props.onPromoteToModerator });
        }
      }

      if (isVerified(account)) {
        menu.push({ text: intl.formatMessage(messages.unverifyUser, { name: account.get('username') }), action: this.props.onUnverifyUser });
      } else {
        menu.push({ text: intl.formatMessage(messages.verifyUser, { name: account.get('username') }), action: this.props.onVerifyUser });
      }

      if (account.get('id') !== me) {
        menu.push({ text: intl.formatMessage(messages.deactivateUser, { name: account.get('username') }), action: this.props.onDeactivateUser });
        menu.push({ text: intl.formatMessage(messages.deleteUser, { name: account.get('username') }), action: this.props.onDeleteUser });
      }
    }

    return menu;
  }

  makeInfo() {
    const { account, me } = this.props;

    const info = [];

    if (!account || !me) return info;

    if (me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      info.push(<span key='followed_by' className='relationship-tag'><FormattedMessage id='account.follows_you' defaultMessage='Follows you' /></span>);
    } else if (me !== account.get('id') && account.getIn(['relationship', 'blocking'])) {
      info.push(<span key='blocked' className='relationship-tag'><FormattedMessage id='account.blocked' defaultMessage='Blocked' /></span>);
    }

    if (me !== account.get('id') && account.getIn(['relationship', 'muting'])) {
      info.push(<span key='muted' className='relationship-tag'><FormattedMessage id='account.muted' defaultMessage='Muted' /></span>);
    } else if (me !== account.get('id') && account.getIn(['relationship', 'domain_blocking'])) {
      info.push(<span key='domain_blocked' className='relationship-tag'><FormattedMessage id='account.domain_blocked' defaultMessage='Domain hidden' /></span>);
    }

    return info;
  }

  render() {
    const { account, intl, username, me, features } = this.props;
    const { isSmallScreen } = this.state;

    if (!account) {
      return (
        <div className='account__header'>
          <div className='account__header__image account__header__image--none' />
          <div className='account__header__bar'>
            <div className='account__header__extra'>
              <div className='account__header__avatar' />
            </div>
            {
              isSmallScreen &&
              <div className='account-mobile-container account-mobile-container--nonuser'>
                <ProfileInfoPanel username={username} />
              </div>
            }
          </div>
        </div>
      );
    }

    const ownAccount = account.get('id') === me;
    const info = this.makeInfo();
    const menu = this.makeMenu();

    const header = account.get('header', '');
    const headerMissing = !header || ['/images/banner.png', '/headers/original/missing.png'].some(path => header.endsWith(path));
    const avatarSize = isSmallScreen ? 90 : 200;
    const deactivated = !account.getIn(['pleroma', 'is_active'], true);

    return (
      <div className={classNames('account__header', { inactive: !!account.get('moved'), deactivated: deactivated })}>
        <div className={classNames('account__header__image', { 'account__header__image--none': headerMissing || deactivated })}>
          <div className='account__header__info'>
            {info}
          </div>

          {header && <a className='account__header__header' href={account.get('header')} onClick={this.handleHeaderClick} target='_blank'>
            <StillImage src={account.get('header')} alt='' className='parallax' />
          </a>}

          {features.accountSubscriptions && <div className='account__header__subscribe'>
            <SubscriptionButton account={account} />
          </div>}
        </div>

        <div className='account__header__bar'>
          <div className='account__header__extra'>

            <a className='account__header__avatar' href={account.get('avatar')} onClick={this.handleAvatarClick} target='_blank'>
              <Avatar account={account} size={avatarSize} />
            </a>

            <div className='account__header__extra__links'>

              <NavLink isActive={this.isStatusesPageActive} activeClassName='active' to={`/@${account.get('acct')}`} title={intl.formatNumber(account.get('statuses_count'))}>
                <span>{shortNumberFormat(account.get('statuses_count'))}</span>
                <span><FormattedMessage id='account.posts' defaultMessage='Posts' /></span>
              </NavLink>

              {(ownAccount || !account.getIn(['pleroma', 'hide_follows'], false)) && <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/following`} title={intl.formatNumber(account.get('following_count'))}>
                {account.getIn(['pleroma', 'hide_follows_count'], false) ? <span>•</span> : <span>{shortNumberFormat(account.get('following_count'))}</span>}
                <span><FormattedMessage id='account.follows' defaultMessage='Follows' /></span>
              </NavLink>}

              {(ownAccount || !account.getIn(['pleroma', 'hide_followers'], false)) && <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/followers`} title={intl.formatNumber(account.get('followers_count'))}>
                {account.getIn(['pleroma', 'hide_followers_count'], false) ? <span>•</span> : <span>{shortNumberFormat(account.get('followers_count'))}</span>}
                <span><FormattedMessage id='account.followers' defaultMessage='Followers' /></span>
              </NavLink>}

              {(ownAccount || !account.getIn(['pleroma', 'hide_favorites'], true)) && <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/favorites`}>
                { /* : TODO : shortNumberFormat(account.get('favourite_count')) */ }
                <span>•</span>
                <span><FormattedMessage id='navigation_bar.favourites' defaultMessage='Likes' /></span>
              </NavLink>}

              {ownAccount &&
                <NavLink
                  exact activeClassName='active' to={`/@${account.get('acct')}/pins`}
                >
                  { /* : TODO : shortNumberFormat(account.get('pinned_count')) */ }
                  <span>•</span>
                  <span><FormattedMessage id='navigation_bar.pins' defaultMessage='Pins' /></span>
                </NavLink>
              }
            </div>

            {
              isSmallScreen &&
              <div className={classNames('account-mobile-container', { 'deactivated': deactivated })}>
                <ProfileInfoPanel username={username} account={account} />
              </div>
            }

            <div className='account__header__extra__buttons'>
              <ActionButton account={account} />
              {me && account.get('id') !== me && account.getIn(['pleroma', 'accepts_chat_messages'], false) === true &&
                <Button className='button-alternative-2' onClick={this.props.onChat}>
                  <Icon id='comment' />
                  <FormattedMessage id='account.message' defaultMessage='Message' />
                </Button>
              }
              {me && <DropdownMenuContainer items={menu} icon='ellipsis-v' size={24} direction='right' />}
            </div>

          </div>
        </div>
      </div>
    );
  }

}

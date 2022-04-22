'use strict';

import classNames from 'classnames';
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import { debounce, throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modals';
import Avatar from 'soapbox/components/avatar';
import Badge from 'soapbox/components/badge';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';
import StillImage from 'soapbox/components/still_image';
import VerificationBadge from 'soapbox/components/verification_badge';
import DropdownMenuContainer from 'soapbox/containers/dropdown_menu_container';
import ActionButton from 'soapbox/features/ui/components/action_button';
import SubscriptionButton from 'soapbox/features/ui/components/subscription_button';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { ProfileInfoPanel } from 'soapbox/features/ui/util/async-components';
import {
  isStaff,
  isAdmin,
  isModerator,
  isLocal,
  isRemote,
  getDomain,
} from 'soapbox/utils/accounts';
import { getAcct } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import { displayFqn } from 'soapbox/utils/state';

const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention' },
  chat: { id: 'account.chat', defaultMessage: 'Chat with @{name}' },
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
  createNote: { id: 'account.create_note', defaultMessage: 'Create a note' },
  editNote: { id: 'account.edit_note', defaultMessage: 'Edit note' },
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
  suggestUser: { id: 'admin.users.actions.suggest_user', defaultMessage: 'Suggest @{name}' },
  unsuggestUser: { id: 'admin.users.actions.unsuggest_user', defaultMessage: 'Unsuggest @{name}' },
  deactivated: { id: 'account.deactivated', defaultMessage: 'Deactivated' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
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
    displayFqn: displayFqn(state),

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
    displayFqn: PropTypes.bool,
  };

  state = {
    isSmallScreen: (window.innerWidth <= 895),
    isLocked: false,
  }

  isStatusesPageActive = (match, location) => {
    if (!match) {
      return false;
    }

    return !location.pathname.match(/\/(followers|following|favorites|pins)\/?$/);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  setRef = (c) => {
    this.node = c;
  }

  handleResize = debounce(() => {
    this.setState({ isSmallScreen: (window.innerWidth <= 895) });
  }, 5, {
    trailing: true,
  });

  handleScroll = throttle(() => {
    const { top } = this.node.getBoundingClientRect();
    const isLocked = top <= 60;

    if (this.state.isLocked !== isLocked) {
      this.setState({ isLocked });
    }
  }, 100, { trailing: true });

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

  handleShare = () => {
    navigator.share({
      text: `@${this.props.account.get('acct')}`,
      url: this.props.account.get('url'),
    }).catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
  }

  makeMenu() {
    const { account, intl, me, meAccount, features } = this.props;

    const menu = [];

    if (!account || !me) {
      return [];
    }

    if ('share' in navigator) {
      menu.push({
        text: intl.formatMessage(messages.share, { name: account.get('username') }),
        action: this.handleShare,
        icon: require('feather-icons/dist/icons/share.svg'),
      });
      menu.push(null);
    }

    if (account.get('id') === me) {
      menu.push({
        text: intl.formatMessage(messages.edit_profile),
        to: '/settings/profile',
        icon: require('@tabler/icons/icons/user.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.preferences),
        to: '/settings/preferences',
        icon: require('@tabler/icons/icons/settings.svg'),
      });
      menu.push(null);
      menu.push({
        text: intl.formatMessage(messages.follow_requests),
        to: '/follow_requests',
        icon: require('@tabler/icons/icons/user-plus.svg'),
      });
      menu.push(null);
      menu.push({
        text: intl.formatMessage(messages.mutes),
        to: '/mutes',
        icon: require('@tabler/icons/icons/circle-x.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.blocks),
        to: '/blocks',
        icon: require('@tabler/icons/icons/ban.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.domain_blocks),
        to: '/domain_blocks',
        icon: require('@tabler/icons/icons/ban.svg'),
      });
    } else {
      menu.push({
        text: intl.formatMessage(messages.mention, { name: account.get('username') }),
        action: this.props.onMention,
        icon: require('feather-icons/dist/icons/at-sign.svg'),
      });

      if (account.getIn(['pleroma', 'accepts_chat_messages'], false) === true) {
        menu.push({
          text: intl.formatMessage(messages.chat, { name: account.get('username') }),
          action: this.props.onChat,
          icon: require('@tabler/icons/icons/messages.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.direct, { name: account.get('username') }),
          action: this.props.onDirect,
          icon: require('@tabler/icons/icons/mail.svg'),
        });
      }

      if (features.notes) {
        menu.push({
          text: intl.formatMessage(account.getIn(['relationship', 'note']) ? messages.editNote : messages.createNote),
          action: this.props.onShowNote,
          icon: require('@tabler/icons/icons/note.svg'),
        });
      }

      if (account.getIn(['relationship', 'following'])) {
        if (account.getIn(['relationship', 'showing_reblogs'])) {
          menu.push({
            text: intl.formatMessage(messages.hideReblogs, { name: account.get('username') }),
            action: this.props.onReblogToggle,
            icon: require('@tabler/icons/icons/repeat.svg'),
          });
        } else {
          menu.push({
            text: intl.formatMessage(messages.showReblogs, { name: account.get('username') }),
            action: this.props.onReblogToggle,
            icon: require('@tabler/icons/icons/repeat.svg'),
          });
        }

        if (features.accountNotifies) {
          if (account.getIn(['relationship', 'notifying'])) {
            menu.push({
              text: intl.formatMessage(messages.unsubscribe, { name: account.get('username') }),
              action: this.props.onNotifyToggle,
              icon: require('@tabler/icons/icons/bell.svg'),
            });
          } else {
            menu.push({
              text: intl.formatMessage(messages.subscribe, { name: account.get('username') }),
              action: this.props.onNotifyToggle,
              icon: require('@tabler/icons/icons/bell-off.svg'),
            });
          }
        } else if (features.accountSubscriptions) {
          if (account.getIn(['relationship', 'subscribing'])) {
            menu.push({
              text: intl.formatMessage(messages.unsubscribe, { name: account.get('username') }),
              action: this.props.onSubscriptionToggle,
              icon: require('@tabler/icons/icons/bell.svg'),
            });
          } else {
            menu.push({
              text: intl.formatMessage(messages.subscribe, { name: account.get('username') }),
              action: this.props.onSubscriptionToggle,
              icon: require('@tabler/icons/icons/bell-off.svg'),
            });
          }
        }

        if (features.lists) {
          menu.push({
            text: intl.formatMessage(messages.add_or_remove_from_list),
            action: this.props.onAddToList,
            icon: require('@tabler/icons/icons/list.svg'),
          });
        }

        if (features.accountEndorsements) {
          menu.push({
            text: intl.formatMessage(account.getIn(['relationship', 'endorsed']) ? messages.unendorse : messages.endorse),
            action: this.props.onEndorseToggle,
            icon: require('@tabler/icons/icons/user-check.svg'),
          });
        }

        menu.push(null);
      } else if (features.lists && features.unrestrictedLists) {
        menu.push({
          text: intl.formatMessage(messages.add_or_remove_from_list),
          action: this.props.onAddToList,
          icon: require('@tabler/icons/icons/list.svg'),
        });
      }

      if (account.getIn(['relationship', 'muting'])) {
        menu.push({
          text: intl.formatMessage(messages.unmute, { name: account.get('username') }),
          action: this.props.onMute,
          icon: require('@tabler/icons/icons/circle-x.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.mute, { name: account.get('username') }),
          action: this.props.onMute,
          icon: require('@tabler/icons/icons/circle-x.svg'),
        });
      }

      if (account.getIn(['relationship', 'blocking'])) {
        menu.push({
          text: intl.formatMessage(messages.unblock, { name: account.get('username') }),
          action: this.props.onBlock,
          icon: require('@tabler/icons/icons/ban.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.block, { name: account.get('username') }),
          action: this.props.onBlock,
          icon: require('@tabler/icons/icons/ban.svg'),
        });
      }

      menu.push({
        text: intl.formatMessage(messages.report, { name: account.get('username') }),
        action: this.props.onReport,
        icon: require('@tabler/icons/icons/flag.svg'),
      });
    }

    if (isRemote(account)) {
      const domain = getDomain(account);

      menu.push(null);

      if (account.getIn(['relationship', 'domain_blocking'])) {
        menu.push({
          text: intl.formatMessage(messages.unblockDomain, { domain }),
          action: this.props.onUnblockDomain,
          icon: require('@tabler/icons/icons/ban.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.blockDomain, { domain }),
          action: this.props.onBlockDomain,
          icon: require('@tabler/icons/icons/ban.svg'),
        });
      }
    }

    if (isStaff(meAccount)) {
      menu.push(null);

      if (isAdmin(meAccount)) {
        menu.push({
          text: intl.formatMessage(messages.admin_account, { name: account.get('username') }),
          href: `/pleroma/admin/#/users/${account.get('id')}/`, newTab: true,
          icon: require('@tabler/icons/icons/gavel.svg'),
        });
      }

      if (account.get('id') !== me && isLocal(account) && isAdmin(meAccount)) {
        if (isAdmin(account)) {
          menu.push({
            text: intl.formatMessage(messages.demoteToModerator, { name: account.get('username') }),
            action: this.props.onPromoteToModerator,
            icon: require('@tabler/icons/icons/arrow-up-circle.svg'),
          });
          menu.push({
            text: intl.formatMessage(messages.demoteToUser, { name: account.get('username') }),
            action: this.props.onDemoteToUser,
            icon: require('@tabler/icons/icons/arrow-down-circle.svg'),
          });
        } else if (isModerator(account)) {
          menu.push({
            text: intl.formatMessage(messages.promoteToAdmin, { name: account.get('username') }),
            action: this.props.onPromoteToAdmin,
            icon: require('@tabler/icons/icons/arrow-up-circle.svg'),
          });
          menu.push({
            text: intl.formatMessage(messages.demoteToUser, { name: account.get('username') }),
            action: this.props.onDemoteToUser,
            icon: require('@tabler/icons/icons/arrow-down-circle.svg'),
          });
        } else {
          menu.push({
            text: intl.formatMessage(messages.promoteToAdmin, { name: account.get('username') }),
            action: this.props.onPromoteToAdmin,
            icon: require('@tabler/icons/icons/arrow-up-circle.svg'),
          });
          menu.push({
            text: intl.formatMessage(messages.promoteToModerator, { name: account.get('username') }),
            action: this.props.onPromoteToModerator,
            icon: require('@tabler/icons/icons/arrow-up-circle.svg'),
          });
        }
      }

      if (account.get('verified')) {
        menu.push({
          text: intl.formatMessage(messages.unverifyUser, { name: account.get('username') }),
          action: this.props.onUnverifyUser,
          icon: require('@tabler/icons/icons/check.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.verifyUser, { name: account.get('username') }),
          action: this.props.onVerifyUser,
          icon: require('@tabler/icons/icons/check.svg'),
        });
      }

      if (features.suggestionsV2 && isAdmin(meAccount)) {
        if (account.getIn(['pleroma', 'is_suggested'])) {
          menu.push({
            text: intl.formatMessage(messages.unsuggestUser, { name: account.get('username') }),
            action: this.props.onUnsuggestUser,
            icon: require('@tabler/icons/icons/user-x.svg'),
          });
        } else {
          menu.push({
            text: intl.formatMessage(messages.suggestUser, { name: account.get('username') }),
            action: this.props.onSuggestUser,
            icon: require('@tabler/icons/icons/user-check.svg'),
          });
        }
      }

      if (account.get('id') !== me) {
        menu.push({
          text: intl.formatMessage(messages.deactivateUser, { name: account.get('username') }),
          action: this.props.onDeactivateUser,
          icon: require('@tabler/icons/icons/user-off.svg'),
        });
        menu.push({
          text: intl.formatMessage(messages.deleteUser, { name: account.get('username') }),
          action: this.props.onDeleteUser,
          icon: require('@tabler/icons/icons/user-minus.svg'),
        });
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

  renderMessageButton() {
    const { intl, account, me } = this.props;

    if (!me || !account || account.get('id') === me) {
      return null;
    }

    const canChat = account.getIn(['pleroma', 'accepts_chat_messages'], false) === true;

    if (canChat) {
      return (
        <IconButton
          src={require('@tabler/icons/icons/messages.svg')}
          onClick={this.props.onChat}
          title={intl.formatMessage(messages.chat, { name: account.get('username') })}
        />
      );
    } else {
      return (
        <IconButton
          src={require('@tabler/icons/icons/mail.svg')}
          onClick={this.props.onDirect}
          title={intl.formatMessage(messages.direct, { name: account.get('username') })}
        />
      );
    }
  }

  renderShareButton() {
    const { intl, account, me } = this.props;
    const canShare = 'share' in navigator;

    if (!(account && me && account.get('id') === me && canShare)) {
      return null;
    }

    return (
      <IconButton
        src={require('feather-icons/dist/icons/share.svg')}
        onClick={this.handleShare}
        title={intl.formatMessage(messages.share, { name: account.get('username') })}
      />
    );
  }

  render() {
    const { account, displayFqn, intl, username, me, features } = this.props;
    const { isSmallScreen, isLocked } = this.state;

    if (!account) {
      return (
        <div className='account__header'>
          <div className='account__header__image account__header__image--none' />
          <div className='account__header__bar' ref={this.setRef}>
            <div className='account__header__extra'>
              <div className='account__header__card'>
                <div className='account__header__avatar' />
              </div>
            </div>
            {isSmallScreen && (
              <div className='account-mobile-container account-mobile-container--nonuser'>
                <BundleContainer fetchComponent={ProfileInfoPanel}>
                  {Component => <Component username={username} />}
                </BundleContainer>
              </div>
            )}
          </div>
        </div>
      );
    }

    const ownAccount = account.get('id') === me;
    const info = this.makeInfo();
    const menu = this.makeMenu();

    const header = account.get('header', '');
    // const headerMissing = !header || ['/images/banner.png', '/headers/original/missing.png'].some(path => header.endsWith(path));
    const avatarSize = isSmallScreen ? 90 : 200;
    const deactivated = !account.getIn(['pleroma', 'is_active'], true);

    const displayNameHtml = deactivated ? { __html: intl.formatMessage(messages.deactivated) } : { __html: account.get('display_name_html') };
    const verified = account.getIn(['pleroma', 'tags'], ImmutableList()).includes('verified');

    return (
      <div className={classNames('account__header', { inactive: !!account.get('moved'), deactivated: deactivated })}>
        <div className={classNames('account__header__image', { /* 'account__header__image--none': headerMissing || deactivated */ })}>
          <div className='account__header__info'>
            {info}
          </div>

          {header && <a className='account__header__header' href={account.get('header')} onClick={this.handleHeaderClick} target='_blank'>
            <StillImage src={account.get('header')} alt='' className='parallax' />
          </a>}

          {(features.accountNotifies || features.accountSubscriptions) && <div className='account__header__subscribe'>
            <SubscriptionButton account={account} features={features} />
          </div>}
        </div>

        <div className='account__header__bar' ref={this.setRef}>
          <div className='account__header__extra'>

            <div className={classNames('account__header__card', { 'is-locked': !isSmallScreen && isLocked })}>
              <a className='account__header__avatar' href={account.get('avatar')} onClick={this.handleAvatarClick} target='_blank' aria-hidden={!isSmallScreen && isLocked}>
                <Avatar account={account} size={avatarSize} />
              </a>
              <div className='account__header__name' aria-hidden={isSmallScreen || !isLocked}>
                <Avatar account={account} size={40} />
                <div>
                  <span dangerouslySetInnerHTML={displayNameHtml} className={classNames('profile-info-panel__name-content', { 'with-badge': verified })} />
                  {verified && <VerificationBadge />}
                  {account.get('bot') && <Badge slug='bot' title={intl.formatMessage(messages.bot)} />}
                  <small>
                    @{getAcct(account, displayFqn)}
                    {account.get('locked') && (
                      <Icon src={require('@tabler/icons/icons/lock.svg')} title={intl.formatMessage(messages.account_locked)} />
                    )}
                  </small>
                </div>
              </div>
            </div>

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

            {isSmallScreen && (
              <div className={classNames('account-mobile-container', { 'deactivated': deactivated })}>
                <BundleContainer fetchComponent={ProfileInfoPanel}>
                  {Component => <Component username={username} account={account} />}
                </BundleContainer>
              </div>
            )}

            <div className='account__header__extra__buttons'>
              {me && <DropdownMenuContainer items={menu} src={require('@tabler/icons/icons/dots.svg')} direction='right' />}
              {this.renderShareButton()}
              {this.renderMessageButton()}
              <ActionButton account={account} />
            </div>

          </div>
        </div>
      </div>
    );
  }

}

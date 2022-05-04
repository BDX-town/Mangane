'use strict';

import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modals';
import Avatar from 'soapbox/components/avatar';
import Badge from 'soapbox/components/badge';
import StillImage from 'soapbox/components/still_image';
import { HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, MenuLink, MenuDivider } from 'soapbox/components/ui';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';
import ActionButton from 'soapbox/features/ui/components/action-button';
import {
  isLocal,
  isRemote,
} from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

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
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  deactivateUser: { id: 'admin.users.actions.deactivate_user', defaultMessage: 'Deactivate @{name}' },
  deleteUser: { id: 'admin.users.actions.delete_user', defaultMessage: 'Delete @{name}' },
  verifyUser: { id: 'admin.users.actions.verify_user', defaultMessage: 'Verify @{name}' },
  unverifyUser: { id: 'admin.users.actions.unverify_user', defaultMessage: 'Unverify @{name}' },
  setDonor: { id: 'admin.users.actions.set_donor', defaultMessage: 'Set @{name} as a donor' },
  removeDonor: { id: 'admin.users.actions.remove_donor', defaultMessage: 'Remove @{name} as a donor' },
  promoteToAdmin: { id: 'admin.users.actions.promote_to_admin', defaultMessage: 'Promote @{name} to an admin' },
  promoteToModerator: { id: 'admin.users.actions.promote_to_moderator', defaultMessage: 'Promote @{name} to a moderator' },
  demoteToModerator: { id: 'admin.users.actions.demote_to_moderator', defaultMessage: 'Demote @{name} to a moderator' },
  demoteToUser: { id: 'admin.users.actions.demote_to_user', defaultMessage: 'Demote @{name} to a regular user' },
  subscribe: { id: 'account.subscribe', defaultMessage: 'Subscribe to notifications from @{name}' },
  unsubscribe: { id: 'account.unsubscribe', defaultMessage: 'Unsubscribe to notifications from @{name}' },
  suggestUser: { id: 'admin.users.actions.suggest_user', defaultMessage: 'Suggest @{name}' },
  unsuggestUser: { id: 'admin.users.actions.unsuggest_user', defaultMessage: 'Unsuggest @{name}' },
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
    account: ImmutablePropTypes.record,
    meaccount: ImmutablePropTypes.record,
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
        icon: require('@tabler/icons/icons/upload.svg'),
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
        to: '/settings',
        icon: require('@tabler/icons/icons/settings.svg'),
      });
      // menu.push(null);
      // menu.push({
      //   text: intl.formatMessage(messages.follow_requests),
      //   to: '/follow_requests',
      //   icon: require('@tabler/icons/icons/user-plus.svg'),
      // });
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
      // menu.push({
      //   text: intl.formatMessage(messages.domain_blocks),
      //   to: '/domain_blocks',
      //   icon: require('@tabler/icons/icons/ban.svg'),
      // });
    } else {
      menu.push({
        text: intl.formatMessage(messages.mention, { name: account.get('username') }),
        action: this.props.onMention,
        icon: require('@tabler/icons/icons/at.svg'),
      });

      // if (account.getIn(['pleroma', 'accepts_chat_messages'], false) === true) {
      //   menu.push({
      //     text: intl.formatMessage(messages.chat, { name: account.get('username') }),
      //     action: this.props.onChat,
      //     icon: require('@tabler/icons/icons/messages.svg'),
      //   });
      // } else {
      //   menu.push({
      //     text: intl.formatMessage(messages.direct, { name: account.get('username') }),
      //     action: this.props.onDirect,
      //     icon: require('@tabler/icons/icons/mail.svg'),
      //   });
      // }

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

        if (features.accountSubscriptions) {
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

        // menu.push({ text: intl.formatMessage(account.getIn(['relationship', 'endorsed']) ? messages.unendorse : messages.endorse), action: this.props.onEndorseToggle });
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
      const domain = account.fqn.split('@')[1];

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

    if (meAccount.staff) {
      menu.push(null);

      if (meAccount.admin) {
        menu.push({
          text: intl.formatMessage(messages.admin_account, { name: account.get('username') }),
          to: `/pleroma/admin/#/users/${account.id}/`,
          newTab: true,
          icon: require('@tabler/icons/icons/gavel.svg'),
        });
      }

      if (account.id !== me && isLocal(account) && meAccount.admin) {
        if (account.admin) {
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
        } else if (account.moderator) {
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

      if (account.verified) {
        menu.push({
          text: intl.formatMessage(messages.unverifyUser, { name: account.username }),
          action: this.props.onUnverifyUser,
          icon: require('@tabler/icons/icons/check.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.verifyUser, { name: account.username }),
          action: this.props.onVerifyUser,
          icon: require('@tabler/icons/icons/check.svg'),
        });
      }

      if (account.donor) {
        menu.push({
          text: intl.formatMessage(messages.removeDonor, { name: account.username }),
          action: this.props.onRemoveDonor,
          icon: require('@tabler/icons/icons/coin.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.setDonor, { name: account.username }),
          action: this.props.onSetDonor,
          icon: require('@tabler/icons/icons/coin.svg'),
        });
      }

      if (features.suggestionsV2 && meAccount.admin) {
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
          icon: require('@tabler/icons/icons/user-minus.svg'),
        });
      }
    }

    return menu;
  }

  makeInfo() {
    const { account, intl, me } = this.props;

    const info = [];

    if (!account || !me) return info;

    if (me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      info.push(
        <Badge
          key='followed_by'
          slug='opaque'
          title={intl.formatMessage({ id: 'account.follows_you', defaultMessage: 'Follows you' })}
        />,
      );
    } else if (me !== account.get('id') && account.getIn(['relationship', 'blocking'])) {
      info.push(
        <Badge
          key='blocked'
          slug='opaque'
          title={intl.formatMessage({ id: 'account.blocked', defaultMessage: 'Blocked' })}
        />,
      );
    }

    if (me !== account.get('id') && account.getIn(['relationship', 'muting'])) {
      info.push(
        <Badge
          key='muted'
          slug='opaque'
          title={intl.formatMessage({ id: 'account.muted', defaultMessage: 'Muted' })}
        />,
      );
    } else if (me !== account.get('id') && account.getIn(['relationship', 'domain_blocking'])) {
      info.push(
        <Badge
          key='domain_blocked'
          slug='opaque'
          title={intl.formatMessage({ id: 'account.domain_blocked', defaultMessage: 'Domain hidden' })}
        />,
      );
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
          className='text-primary-700 bg-primary-100 hover:bg-primary-200 p-2'
          iconClassName='w-5 h-5'
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
        src={require('@tabler/icons/icons/upload.svg')}
        onClick={this.handleShare}
        title={intl.formatMessage(messages.share, { name: account.get('username') })}
        className='text-primary-700 bg-primary-100 dark:!bg-slate-700 dark:!text-white hover:bg-primary-200 p-2'
        iconClassName='w-5 h-5'
      />
    );
  }

  render() {
    const { account, me } = this.props;

    if (!account) {
      return (
        <div className='-mt-4 -mx-4'>
          <div>
            <div className='relative h-32 w-full lg:h-48 md:rounded-t-xl bg-gray-200 dark:bg-slate-900/50' />
          </div>

          <div className='px-4 sm:px-6'>
            <div className='-mt-12 flex items-end space-x-5'>
              <div className='flex relative'>
                <div
                  className='h-24 w-24 bg-gray-400 rounded-full ring-4 ring-white dark:ring-slate-800'
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    const info = this.makeInfo();
    const menu = this.makeMenu();
    const header = account.get('header', '');

    // NOTE: Removing Subscription element
    //   {features.accountSubscriptions && <div className='account__header__subscribe'>
    //   <SubscriptionButton account={account} />
    // </div>}

    return (
      <div className='-mt-4 -mx-4'>
        <div>
          <div className='relative h-32 w-full lg:h-48 md:rounded-t-xl bg-gray-200 dark:bg-slate-900/50'>
            {header && (
              <a href={account.get('header')} onClick={this.handleHeaderClick} target='_blank'>
                <StillImage
                  src={account.get('header')}
                  alt='Profile Header'
                  className='absolute inset-0 object-cover md:rounded-t-xl'
                />
              </a>
            )}

            <div className='absolute top-2 left-2'>
              <HStack alignItems='center' space={1}>
                {info}
              </HStack>
            </div>
          </div>
        </div>

        <div className='px-4 sm:px-6'>
          <div className='-mt-12 flex items-end space-x-5'>
            <div className='flex'>
              <a href={account.get('avatar')} onClick={this.handleAvatarClick} target='_blank'>
                <Avatar
                  account={account}
                  className='h-24 w-24 rounded-full ring-4 ring-white dark:ring-slate-800'
                />
              </a>
            </div>

            <div className='mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
              <div className='mt-10 flex justify-stretch flex-row space-y-0 space-x-2'>
                {me && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      src={require('@tabler/icons/icons/dots.svg')}
                      className='text-primary-700 bg-primary-100 dark:!bg-slate-700 dark:!text-white hover:bg-primary-200 p-2'
                      iconClassName='w-5 h-5'
                    />

                    <MenuList>
                      {menu.map((menuItem, idx) => {
                        if (typeof menuItem?.text === 'undefined') {
                          return <MenuDivider key={idx} />;
                        } else {
                          const Comp = menuItem.action ? MenuItem : MenuLink;
                          const itemProps = menuItem.action ? { onSelect: menuItem.action } : { to: menuItem.to, as: Link, target: menuItem.newTab ? '_blank' : '_self' };

                          return (
                            <Comp key={idx} {...itemProps} className='group'>
                              <div className='flex items-center'>
                                <SvgIcon src={menuItem.icon} className='mr-3 h-5 w-5 text-gray-400 flex-none group-hover:text-gray-500' />

                                <div className='truncate'>{menuItem.text}</div>
                              </div>
                            </Comp>
                          );
                        }
                      })}
                    </MenuList>
                  </Menu>
                )}

                {this.renderShareButton()}
                {/* {this.renderMessageButton()} */}

                <ActionButton account={account} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

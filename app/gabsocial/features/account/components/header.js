'use strict';

import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Button from 'gabsocial/components/button';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { autoPlayGif, isStaff } from 'gabsocial/initial_state';
import classNames from 'classnames';
import Avatar from 'gabsocial/components/avatar';
import { shortNumberFormat } from 'gabsocial/utils/numbers';
import { NavLink } from 'react-router-dom';
import DropdownMenuContainer from 'gabsocial/containers/dropdown_menu_container';
import ProfileInfoPanel from '../../ui/components/profile_info_panel';
import { debounce } from 'lodash';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention' },
  direct: { id: 'account.direct', defaultMessage: 'Direct message @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
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
});

const mapStateToProps = state => {
  return {
    me: state.get('me'),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Header extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    identity_props: ImmutablePropTypes.list,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    domain: PropTypes.string.isRequired,
    username: PropTypes.string,
  };

  state = {
    isSmallScreen: (window.innerWidth <= 895),
  }

  openEditProfile = () => {
    window.open('/settings/profile', '_blank');
  }

  isStatusesPageActive = (match, location) => {
    if (!match) {
      return false;
    }

    return !location.pathname.match(/\/(followers|following|favorites|pins)\/?$/);
  }

  componentWillMount () {
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = debounce(() => {
    this.setState({ isSmallScreen: (window.innerWidth <= 895) });
  }, 5, {
    trailing: true,
  });

  makeMenu() {
    const { account, intl, me } = this.props;

    let menu = [];

    if (!account || !me) {
      return [];
    }

    if ('share' in navigator) {
      menu.push({ text: intl.formatMessage(messages.share, { name: account.get('username') }), action: this.handleShare });
      menu.push(null);
    }

    if (account.get('id') === me) {
      menu.push({ text: intl.formatMessage(messages.edit_profile), href: '/settings/profile' });
      menu.push({ text: intl.formatMessage(messages.preferences), href: '/settings/preferences' });
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

        menu.push({ text: intl.formatMessage(messages.add_or_remove_from_list), action: this.props.onAddToList });
        menu.push({ text: intl.formatMessage(account.getIn(['relationship', 'endorsed']) ? messages.unendorse : messages.endorse), action: this.props.onEndorseToggle });
        menu.push(null);
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

    if (account.get('acct') !== account.get('username')) {
      const domain = account.get('acct').split('@')[1];

      menu.push(null);

      if (account.getIn(['relationship', 'domain_blocking'])) {
        menu.push({ text: intl.formatMessage(messages.unblockDomain, { domain }), action: this.props.onUnblockDomain });
      } else {
        menu.push({ text: intl.formatMessage(messages.blockDomain, { domain }), action: this.props.onBlockDomain });
      }
    }

    if (account.get('id') !== me && isStaff) {
      menu.push(null);
      menu.push({ text: intl.formatMessage(messages.admin_account, { name: account.get('username') }), href: `/admin/accounts/${account.get('id')}` });
    }

    return menu;
  }

  makeInfo() {
    const { account, me } = this.props;

    let info = [];

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
  };

  getActionBtn() {
    const { account, intl, me } = this.props;

    let actionBtn = null;

    if (!account || !me) return actionBtn;

    if (me !== account.get('id')) {
      if (!account.get('relationship')) { // Wait until the relationship is loaded
        //
      } else if (account.getIn(['relationship', 'requested'])) {
        actionBtn = <Button className='logo-button' text={intl.formatMessage(messages.requested)} onClick={this.props.onFollow} />;
      } else if (!account.getIn(['relationship', 'blocking'])) {
        actionBtn = <Button disabled={account.getIn(['relationship', 'blocked_by'])} className={classNames('logo-button', { 'button--destructive': account.getIn(['relationship', 'following']) })} text={intl.formatMessage(account.getIn(['relationship', 'following']) ? messages.unfollow : messages.follow)} onClick={this.props.onFollow} />;
      } else if (account.getIn(['relationship', 'blocking'])) {
        actionBtn = <Button className='logo-button' text={intl.formatMessage(messages.unblock, { name: account.get('username') })} onClick={this.props.onBlock} />;
      }
    }

    return actionBtn;
  };

  render () {
    const { account, intl, username, me } = this.props;
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

    const info = this.makeInfo();
    const actionBtn = this.getActionBtn();
    const menu = this.makeMenu();

    const headerImgSrc = autoPlayGif ? account.get('header') : account.get('header_static');
    const headerMissing = (headerImgSrc.indexOf('/headers/original/missing.png') > -1);

    const avatarSize = isSmallScreen ? 90 : 200;

    return (
      <div className={classNames('account__header', { inactive: !!account.get('moved') })}>
        <div className={classNames('account__header__image', { 'account__header__image--none': headerMissing })}>
          <div className='account__header__info'>
            {info}
          </div>

          <img src={headerImgSrc} alt='' className='parallax' />
        </div>

        <div className='account__header__bar'>
          <div className='account__header__extra'>

            <div className='account__header__avatar'>
              <Avatar account={account} size={avatarSize} />
            </div>

            <div className='account__header__extra__links'>

              <NavLink isActive={this.isStatusesPageActive} activeClassName='active' to={`/@${account.get('acct')}`} title={intl.formatNumber(account.get('statuses_count'))}>
                {shortNumberFormat(account.get('statuses_count'))}
                <FormattedMessage id='account.posts' defaultMessage='Posts' />
              </NavLink>

              <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/following`} title={intl.formatNumber(account.get('following_count'))}>
                {shortNumberFormat(account.get('following_count'))}
                <FormattedMessage id='account.follows' defaultMessage='Follows' />
              </NavLink>

              <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/followers`} title={intl.formatNumber(account.get('followers_count'))}>
                {shortNumberFormat(account.get('followers_count'))}
                <FormattedMessage id='account.followers' defaultMessage='Followers' />
              </NavLink>

              {
                account.get('id') === me &&
                <div>
                  <NavLink
                    exact activeClassName='active' to={`/@${account.get('acct')}/favorites`}
                  >
                    { /* : TODO : shortNumberFormat(account.get('favourite_count')) */ }
                    <span>•</span>
                    <FormattedMessage id='navigation_bar.favourites' defaultMessage='Favorites' />
                  </NavLink>
                  <NavLink
                    exact activeClassName='active' to={`/@${account.get('acct')}/pins`}
                  >
                    { /* : TODO : shortNumberFormat(account.get('pinned_count')) */ }
                    <span>•</span>
                    <FormattedMessage id='navigation_bar.pins' defaultMessage='Pins' />
                  </NavLink>
                </div>
              }
            </div>

            {
              isSmallScreen &&
              <div className='account-mobile-container'>
                <ProfileInfoPanel username={username} account={account} />
              </div>
            }

            {
              me &&
              <div className='account__header__extra__buttons'>
                {actionBtn}
                {account.get('id') !== me &&
                  <Button className='button button-alternative-2' onClick={this.props.onDirect}>
                    <FormattedMessage
                      id='account.message' defaultMessage='Message' values={{
                        name: account.get('acct'),
                      }}
                    />
                  </Button>
                }
                <DropdownMenuContainer items={menu} icon='ellipsis-v' size={24} direction='right' />
              </div>
            }

          </div>
        </div>
      </div>
    );
  }

}

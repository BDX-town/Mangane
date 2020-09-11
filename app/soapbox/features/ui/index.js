'use strict';

import classNames from 'classnames';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import NotificationsContainer from './containers/notifications_container';
import LoadingBarContainer from './containers/loading_bar_container';
import ModalContainer from './containers/modal_container';
import { isMobile } from '../../is_mobile';
import { debounce } from 'lodash';
import { uploadCompose, resetCompose } from '../../actions/compose';
import { expandHomeTimeline } from '../../actions/timelines';
import { expandNotifications } from '../../actions/notifications';
import { fetchReports } from '../../actions/admin';
import { fetchFilters } from '../../actions/filters';
import { fetchChats } from 'soapbox/actions/chats';
import { clearHeight } from '../../actions/height_cache';
import { openModal } from '../../actions/modal';
import { WrappedRoute } from './util/react_router_helpers';
import UploadArea from './components/upload_area';
import TabsBar from './components/tabs_bar';
import LinkFooter from './components/link_footer';
import FeaturesPanel from './components/features_panel';
import ProfilePage from 'soapbox/pages/profile_page';
// import GroupsPage from 'soapbox/pages/groups_page';
// import GroupPage from 'soapbox/pages/group_page';
// import GroupSidebarPanel from '../groups/sidebar_panel';
import SearchPage from 'soapbox/pages/search_page';
import HomePage from 'soapbox/pages/home_page';
import SidebarMenu from '../../components/sidebar_menu';
import { connectUserStream } from '../../actions/streaming';
import { Redirect } from 'react-router-dom';
import Icon from 'soapbox/components/icon';
import { isStaff } from 'soapbox/utils/accounts';
import ChatPanes from 'soapbox/features/chats/components/chat_panes';
import ProfileHoverCard from 'soapbox/components/profile_hover_card';

import {
  Status,
  // GettingStarted,
  CommunityTimeline,
  PublicTimeline,
  AccountTimeline,
  AccountGallery,
  HomeTimeline,
  Followers,
  Following,
  Reblogs,
  // Favourites,
  DirectTimeline,
  HashtagTimeline,
  Notifications,
  FollowRequests,
  GenericNotFound,
  FavouritedStatuses,
  Blocks,
  DomainBlocks,
  Mutes,
  Filters,
  PinnedStatuses,
  Search,
  // Explore,
  // Groups,
  // GroupTimeline,
  ListTimeline,
  Lists,
  Bookmarks,
  // GroupMembers,
  // GroupRemovedAccounts,
  // GroupCreate,
  // GroupEdit,
  LoginPage,
  Preferences,
  EditProfile,
  SoapboxConfig,
  PasswordReset,
  SecurityForm,
  MfaForm,
  ChatIndex,
  ChatRoom,
} from './util/async-components';

// Dummy import, to make sure that <Status /> ends up in the application bundle.
// Without this it ends up in ~8 very commonly used bundles.
import '../../components/status';

const messages = defineMessages({
  beforeUnload: { id: 'ui.beforeunload', defaultMessage: 'Your draft will be lost if you leave.' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Publish' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);

  return {
    isComposing: state.getIn(['compose', 'is_composing']),
    hasComposingText: state.getIn(['compose', 'text']).trim().length !== 0,
    hasMediaAttachments: state.getIn(['compose', 'media_attachments']).size > 0,
    dropdownMenuIsOpen: state.getIn(['dropdown_menu', 'openId']) !== null,
    accessToken: state.getIn(['auth', 'user', 'access_token']),
    streamingUrl: state.getIn(['instance', 'urls', 'streaming_api']),
    me,
    account,
  };
};

const keyMap = {
  help: '?',
  new: 'n',
  search: 's',
  forceNew: 'option+n',
  focusColumn: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  reply: 'r',
  favourite: 'f',
  boost: 'b',
  mention: 'm',
  open: ['enter', 'o'],
  openProfile: 'p',
  moveDown: ['down', 'j'],
  moveUp: ['up', 'k'],
  back: 'backspace',
  goToHome: 'g h',
  goToNotifications: 'g n',
  goToStart: 'g s',
  goToFavourites: 'g f',
  goToPinned: 'g p',
  goToProfile: 'g u',
  goToBlocked: 'g b',
  goToMuted: 'g m',
  goToRequests: 'g r',
  toggleHidden: 'x',
  toggleSensitive: 'h',
};

const LAYOUT = {
  EMPTY: {
    LEFT: null,
    RIGHT: null,
  },
  DEFAULT: {
    LEFT: [
      <LinkFooter key='1' />,
    ],
    RIGHT: [
      <FeaturesPanel key='0' />,
    ],
  },
  STATUS: {
    TOP: null,
    LEFT: null,
    RIGHT: [
      <LinkFooter key='2' />,
    ],
  },
};

class SwitchingColumnsArea extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    onLayoutChange: PropTypes.func.isRequired,
  };

  state = {
    mobile: isMobile(window.innerWidth),
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = debounce(() => {
    // The cached heights are no longer accurate, invalidate
    this.props.onLayoutChange();

    this.setState({ mobile: isMobile(window.innerWidth) });
  }, 500, {
    trailing: true,
  });

  setRef = c => {
    this.node = c.getWrappedInstance();
  }

  render() {
    const { children } = this.props;

    return (
      <Switch>
        <WrappedRoute path='/auth/sign_in' component={LoginPage} publicRoute exact />
        <WrappedRoute path='/auth/reset_password' component={PasswordReset} publicRoute exact />
        <WrappedRoute path='/auth/edit' layout={LAYOUT.DEFAULT} component={SecurityForm} exact />
        <WrappedRoute path='/auth/mfa' layout={LAYOUT.DEFAULT} component={MfaForm} exact />

        <WrappedRoute path='/' exact page={HomePage} component={HomeTimeline} content={children} />
        <WrappedRoute path='/timeline/local' exact page={HomePage} component={CommunityTimeline} content={children} />
        <WrappedRoute path='/timeline/fediverse' exact page={HomePage} component={PublicTimeline} content={children} />
        <WrappedRoute path='/messages' layout={LAYOUT.DEFAULT} component={DirectTimeline} content={children} componentParams={{ shouldUpdateScroll: this.shouldUpdateScroll }} />

        {/*
        <WrappedRoute path='/groups' exact page={GroupsPage} component={Groups} content={children} componentParams={{ activeTab: 'featured' }} />
        <WrappedRoute path='/groups/create' page={GroupsPage} component={Groups} content={children} componentParams={{ showCreateForm: true, activeTab: 'featured' }} />
        <WrappedRoute path='/groups/browse/member' page={GroupsPage} component={Groups} content={children} componentParams={{ activeTab: 'member' }} />
        <WrappedRoute path='/groups/browse/admin' page={GroupsPage} component={Groups} content={children} componentParams={{ activeTab: 'admin' }} />
        <WrappedRoute path='/groups/:id/members' page={GroupPage} component={GroupMembers} content={children} />
        <WrappedRoute path='/groups/:id/removed_accounts' page={GroupPage} component={GroupRemovedAccounts} content={children} />
        <WrappedRoute path='/groups/:id/edit' page={GroupPage} component={GroupEdit} content={children} />
        <WrappedRoute path='/groups/:id' page={GroupPage} component={GroupTimeline} content={children} />
        */}

        {/* Redirects from Pleroma FE, etc. to fix old bookmarks */}
        <Redirect from='/main/all' to='/timeline/fediverse' />
        <Redirect from='/main/public' to='/timeline/local' />
        <Redirect from='/main/friends' to='/' />
        <Redirect from='/tag/:id' to='/tags/:id' />
        <Redirect from='/user-settings' to='/settings/profile' />
        <WrappedRoute path='/notice/:statusId' publicRoute exact layout={LAYOUT.STATUS} component={Status} content={children} />
        <Redirect from='/users/:username' to='/@:username' />
        <Redirect from='/home' to='/' />

        <WrappedRoute path='/tags/:id' publicRoute component={HashtagTimeline} content={children} />

        <WrappedRoute path='/lists' layout={LAYOUT.DEFAULT} component={Lists} content={children} />
        <WrappedRoute path='/list/:id' page={HomePage} component={ListTimeline} content={children} />
        <WrappedRoute path='/bookmarks' layout={LAYOUT.DEFAULT} component={Bookmarks} content={children} />

        <WrappedRoute path='/notifications' layout={LAYOUT.DEFAULT} component={Notifications} content={children} />

        <WrappedRoute path='/search' publicRoute page={SearchPage} component={Search} content={children} />

        <WrappedRoute path='/chats' exact layout={LAYOUT.DEFAULT} component={ChatIndex} content={children} />
        <WrappedRoute path='/chats/:chatId' layout={LAYOUT.DEFAULT} component={ChatRoom} content={children} />

        <WrappedRoute path='/follow_requests' layout={LAYOUT.DEFAULT} component={FollowRequests} content={children} />
        <WrappedRoute path='/blocks' layout={LAYOUT.DEFAULT} component={Blocks} content={children} />
        <WrappedRoute path='/domain_blocks' layout={LAYOUT.DEFAULT} component={DomainBlocks} content={children} />
        <WrappedRoute path='/mutes' layout={LAYOUT.DEFAULT} component={Mutes} content={children} />
        <WrappedRoute path='/filters' layout={LAYOUT.DEFAULT} component={Filters} content={children} />
        <WrappedRoute path='/@:username' publicRoute exact component={AccountTimeline} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/with_replies' component={AccountTimeline} page={ProfilePage} content={children} componentParams={{ withReplies: true }} />
        <WrappedRoute path='/@:username/followers' component={Followers} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/following' component={Following} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/media' component={AccountGallery} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/tagged/:tag' exact component={AccountTimeline} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/favorites' component={FavouritedStatuses} page={ProfilePage} content={children}  />
        <WrappedRoute path='/@:username/pins' component={PinnedStatuses} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/posts/:statusId' publicRoute exact layout={LAYOUT.STATUS} component={Status} content={children} />
        <WrappedRoute path='/@:username/posts/:statusId/reblogs' layout={LAYOUT.STATUS} component={Reblogs} content={children} />

        <WrappedRoute path='/statuses/:statusId' exact component={Status} content={children} componentParams={{ shouldUpdateScroll: this.shouldUpdateScroll }} />

        <Redirect exact from='/settings' to='/settings/preferences' />
        <WrappedRoute path='/settings/preferences' layout={LAYOUT.DEFAULT} component={Preferences} content={children} />
        <WrappedRoute path='/settings/profile' layout={LAYOUT.DEFAULT} component={EditProfile} content={children} />
        <WrappedRoute path='/soapbox/config' layout={LAYOUT.DEFAULT} component={SoapboxConfig} content={children} />

        <WrappedRoute layout={LAYOUT.EMPTY} component={GenericNotFound} content={children} />
      </Switch>
    );
  }

}

export default @connect(mapStateToProps)
@injectIntl
@withRouter
class UI extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node,
    isComposing: PropTypes.bool,
    hasComposingText: PropTypes.bool,
    hasMediaAttachments: PropTypes.bool,
    location: PropTypes.object,
    intl: PropTypes.object.isRequired,
    dropdownMenuIsOpen: PropTypes.bool,
    me: SoapboxPropTypes.me,
    streamingUrl: PropTypes.string,
    account: PropTypes.object,
  };

  state = {
    draggingOver: false,
    mobile: isMobile(window.innerWidth),
  };

  handleBeforeUnload = (e) => {
    const { intl, isComposing, hasComposingText, hasMediaAttachments } = this.props;

    if (isComposing && (hasComposingText || hasMediaAttachments)) {
      // Setting returnValue to any string causes confirmation dialog.
      // Many browsers no longer display this text to users,
      // but we set user-friendly message for other browsers, e.g. Edge.
      e.returnValue = intl.formatMessage(messages.beforeUnload);
    }
  }

  handleLayoutChange = () => {
    // The cached heights are no longer accurate, invalidate
    this.props.dispatch(clearHeight());
  }

  handleDragEnter = (e) => {
    e.preventDefault();

    if (!this.dragTargets) {
      this.dragTargets = [];
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target);
    }

    if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
      this.setState({ draggingOver: true });
    }
  }

  handleDragOver = (e) => {
    if (this.dataTransferIsText(e.dataTransfer)) return false;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.dataTransfer.dropEffect = 'copy';
    } catch (err) {

    }

    return false;
  }

  handleDrop = (e) => {
    const { me } = this.props;
    if (!me) return;

    if (this.dataTransferIsText(e.dataTransfer)) return;
    e.preventDefault();

    this.setState({ draggingOver: false });
    this.dragTargets = [];

    if (e.dataTransfer && e.dataTransfer.files.length >= 1) {
      this.props.dispatch(uploadCompose(e.dataTransfer.files));
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.node.contains(el));

    if (this.dragTargets.length > 0) {
      return;
    }

    this.setState({ draggingOver: false });
  }

  dataTransferIsText = (dataTransfer) => {
    return (dataTransfer && Array.from(dataTransfer.types).includes('text/plain') && dataTransfer.items.length === 1);
  }

  closeUploadModal = () => {
    this.setState({ draggingOver: false });
  }

  handleServiceWorkerPostMessage = ({ data }) => {
    if (data.type === 'navigate') {
      this.context.router.history.push(data.path);
    } else {
      console.warn('Unknown message type:', data.type);
    }
  }

  connectStreaming = (prevProps) => {
    const { dispatch } = this.props;
    const keys = ['accessToken', 'streamingUrl'];
    const credsSet = keys.every(p => this.props[p]);
    if (!this.disconnect && credsSet) {
      this.disconnect = dispatch(connectUserStream());
    }
  }

  disconnectStreaming = () => {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleResize = debounce(() => {
    this.setState({ mobile: isMobile(window.innerWidth) });
  }, 500, {
    trailing: true,
  });

  componentDidMount() {
    const { account } = this.props;
    if (!account) return;
    window.addEventListener('beforeunload', this.handleBeforeUnload, false);
    window.addEventListener('resize', this.handleResize, { passive: true });

    document.addEventListener('dragenter', this.handleDragEnter, false);
    document.addEventListener('dragover', this.handleDragOver, false);
    document.addEventListener('drop', this.handleDrop, false);
    document.addEventListener('dragleave', this.handleDragLeave, false);
    document.addEventListener('dragend', this.handleDragEnd, false);

    if ('serviceWorker' in  navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerPostMessage);
    }

    if (typeof window.Notification !== 'undefined' && Notification.permission === 'default') {
      window.setTimeout(() => Notification.requestPermission(), 120 * 1000);
    }

    if (account) {
      this.props.dispatch(expandHomeTimeline());
      this.props.dispatch(expandNotifications());
      this.props.dispatch(fetchChats());
      // this.props.dispatch(fetchGroups('member'));
      if (isStaff(account))
        this.props.dispatch(fetchReports({ state: 'open' }));

      setTimeout(() => this.props.dispatch(fetchFilters()), 500);
    }
    this.connectStreaming();
  }

  componentDidUpdate(prevProps) {
    this.connectStreaming();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('dragenter', this.handleDragEnter);
    document.removeEventListener('dragover', this.handleDragOver);
    document.removeEventListener('drop', this.handleDrop);
    document.removeEventListener('dragleave', this.handleDragLeave);
    document.removeEventListener('dragend', this.handleDragEnd);
    this.disconnectStreaming();
  }

  setRef = c => {
    this.node = c;
  }

  handleHotkeyNew = e => {
    e.preventDefault();

    const element = this.node.querySelector('.compose-form__autosuggest-wrapper textarea');

    if (element) {
      element.focus();
    }
  }

  handleHotkeySearch = e => {
    e.preventDefault();

    const element = this.node.querySelector('.search__input');

    if (element) {
      element.focus();
    }
  }

  handleHotkeyForceNew = e => {
    this.handleHotkeyNew(e);
    this.props.dispatch(resetCompose());
  }

  handleHotkeyFocusColumn = e => {
    const index  = (e.key * 1) + 1; // First child is drawer, skip that
    const column = this.node.querySelector(`.column:nth-child(${index})`);
    if (!column) return;
    const container = column.querySelector('.scrollable');

    if (container) {
      const status = container.querySelector('.focusable');

      if (status) {
        if (container.scrollTop > status.offsetTop) {
          status.scrollIntoView(true);
        }
        status.focus();
      }
    }
  }

  handleHotkeyBack = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/');
    } else {
      this.context.router.history.goBack();
    }
  }

  setHotkeysRef = c => {
    const { me } = this.props;
    this.hotkeys = c;

    if (!me || !this.hotkeys) return;
    this.hotkeys.__mousetrap__.stopCallback = (e, element) => {
      return ['TEXTAREA', 'SELECT', 'INPUT'].includes(element.tagName);
    };
  }

  handleHotkeyToggleHelp = () => {
    this.props.dispatch(openModal('HOTKEYS'));
  }

  handleHotkeyGoToHome = () => {
    this.context.router.history.push('/');
  }

  handleHotkeyGoToNotifications = () => {
    this.context.router.history.push('/notifications');
  }

  handleHotkeyGoToStart = () => {
    this.context.router.history.push('/getting-started');
  }

  handleHotkeyGoToFavourites = () => {
    const { account } = this.props;
    if (!account) return;

    this.context.router.history.push(`/${account.get('username')}/favorites`);
  }

  handleHotkeyGoToPinned = () => {
    const { account } = this.props;
    if (!account) return;

    this.context.router.history.push(`/${account.get('username')}/pins`);
  }

  handleHotkeyGoToProfile = () => {
    const { account } = this.props;
    if (!account) return;

    this.context.router.history.push(`/${account.get('username')}`);
  }

  handleHotkeyGoToBlocked = () => {
    this.context.router.history.push('/blocks');
  }

  handleHotkeyGoToMuted = () => {
    this.context.router.history.push('/mutes');
  }

  handleHotkeyGoToRequests = () => {
    this.context.router.history.push('/follow_requests');
  }

  handleOpenComposeModal = () => {
    this.props.dispatch(openModal('COMPOSE'));
  }

  shouldHideFAB = () => {
    const path = this.context.router.history.location.pathname;
    return path.match(/^\/posts\/|^\/search|^\/getting-started|^\/chats/);
  }

  isChatRoomLocation = () => {
    const path = this.context.router.history.location.pathname;
    return path.match(/^\/chats\/(.*)/);
  }

  render() {
    const { streamingUrl } = this.props;
    const { draggingOver, mobile } = this.state;
    const { intl, children, isComposing, location, dropdownMenuIsOpen, me } = this.props;

    if (me === null || !streamingUrl) return null;

    const handlers = me ? {
      help: this.handleHotkeyToggleHelp,
      new: this.handleHotkeyNew,
      search: this.handleHotkeySearch,
      forceNew: this.handleHotkeyForceNew,
      focusColumn: this.handleHotkeyFocusColumn,
      back: this.handleHotkeyBack,
      goToHome: this.handleHotkeyGoToHome,
      goToNotifications: this.handleHotkeyGoToNotifications,
      goToStart: this.handleHotkeyGoToStart,
      goToFavourites: this.handleHotkeyGoToFavourites,
      goToPinned: this.handleHotkeyGoToPinned,
      goToProfile: this.handleHotkeyGoToProfile,
      goToBlocked: this.handleHotkeyGoToBlocked,
      goToMuted: this.handleHotkeyGoToMuted,
      goToRequests: this.handleHotkeyGoToRequests,
    } : {};

    const fabElem = (
      <button
        key='floating-action-button'
        onClick={this.handleOpenComposeModal}
        className='floating-action-button'
        aria-label={intl.formatMessage(messages.publish)}
      >
        <Icon id='pencil' fixedWidth />
      </button>
    );

    const floatingActionButton = this.shouldHideFAB() ? null : fabElem;

    const classnames = classNames('ui', {
      'is-composing': isComposing,
      'ui--chatroom': this.isChatRoomLocation(),
    });

    const style = {
      pointerEvents: dropdownMenuIsOpen ? 'none' : null,
    };

    return (
      <HotKeys keyMap={keyMap} handlers={handlers} ref={this.setHotkeysRef} attach={window} focused>
        <div className={classnames} ref={this.setRef} style={style}>
          <TabsBar />
          <SwitchingColumnsArea location={location} onLayoutChange={this.handleLayoutChange}>
            {children}
          </SwitchingColumnsArea>

          {me && floatingActionButton}

          <NotificationsContainer />
          <LoadingBarContainer className='loading-bar' />
          <ModalContainer />
          <UploadArea active={draggingOver} onClose={this.closeUploadModal} />
          {me && <SidebarMenu />}
          {me && !mobile && <ChatPanes />}
          <ProfileHoverCard />
        </div>
      </HotKeys>
    );
  }

}

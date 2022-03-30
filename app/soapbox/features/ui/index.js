'use strict';

import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import { fetchChats } from 'soapbox/actions/chats';
import { fetchCustomEmojis } from 'soapbox/actions/custom_emojis';
import { fetchMarker } from 'soapbox/actions/markers';
import { register as registerPushNotifications } from 'soapbox/actions/push_notifications';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import Icon from 'soapbox/components/icon';
import ThumbNavigation from 'soapbox/components/thumb_navigation';
import AdminPage from 'soapbox/pages/admin_page';
import DefaultPage from 'soapbox/pages/default_page';
// import GroupsPage from 'soapbox/pages/groups_page';
// import GroupPage from 'soapbox/pages/group_page';
import EmptyPage from 'soapbox/pages/default_page';
import HomePage from 'soapbox/pages/home_page';
import ProfilePage from 'soapbox/pages/profile_page';
import RemoteInstancePage from 'soapbox/pages/remote_instance_page';
import StatusPage from 'soapbox/pages/status_page';
import { isStaff, isAdmin } from 'soapbox/utils/accounts';
import { getAccessToken } from 'soapbox/utils/auth';
import { getVapidKey } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

import { fetchFollowRequests } from '../../actions/accounts';
import { fetchReports, fetchUsers, fetchConfig } from '../../actions/admin';
import { uploadCompose, resetCompose } from '../../actions/compose';
import { fetchFilters } from '../../actions/filters';
import { clearHeight } from '../../actions/height_cache';
import { openModal } from '../../actions/modals';
import { expandNotifications } from '../../actions/notifications';
import { fetchScheduledStatuses } from '../../actions/scheduled_statuses';
import { connectUserStream } from '../../actions/streaming';
import { expandHomeTimeline } from '../../actions/timelines';
import PreHeader from '../../features/public_layout/components/pre_header';
// import GroupSidebarPanel from '../groups/sidebar_panel';

import BackgroundShapes from './components/background_shapes';
import Navbar from './components/navbar';
import BundleContainer from './containers/bundle_container';
import {
  Status,
  CommunityTimeline,
  PublicTimeline,
  RemoteTimeline,
  AccountTimeline,
  AccountGallery,
  HomeTimeline,
  Followers,
  Following,
  DirectTimeline,
  Conversations,
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
  // Groups,
  // GroupTimeline,
  ListTimeline,
  Lists,
  Bookmarks,
  // GroupMembers,
  // GroupRemovedAccounts,
  // GroupCreate,
  // GroupEdit,
  ExternalLogin,
  Settings,
  MediaDisplay,
  EditProfile,
  EditEmail,
  EditPassword,
  EmailConfirmation,
  DeleteAccount,
  SoapboxConfig,
  // ExportData,
  // ImportData,
  // Backups,
  MfaForm,
  ChatIndex,
  ChatRoom,
  ChatPanes,
  ServerInfo,
  Dashboard,
  AwaitingApproval,
  Reports,
  ModerationLog,
  CryptoDonate,
  ScheduledStatuses,
  UserIndex,
  FederationRestrictions,
  Aliases,
  Migration,
  FollowRecommendations,
  Directory,
  SidebarMenu,
  UploadArea,
  NotificationsContainer,
  ModalContainer,
  ProfileHoverCard,
  RegisterInvite,
  Share,
  NewStatus,
  IntentionalError,
  Developers,
  CreateApp,
  SettingsStore,
} from './util/async-components';
import { WrappedRoute } from './util/react_router_helpers';

// Dummy import, to make sure that <Status /> ends up in the application bundle.
// Without this it ends up in ~8 very commonly used bundles.
import '../../components/status';

const isMobile = width => width <= 1190;

const messages = defineMessages({
  beforeUnload: { id: 'ui.beforeunload', defaultMessage: 'Your draft will be lost if you leave.' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Publish' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);
  const instance = state.get('instance');
  const soapbox = getSoapboxConfig(state);
  const vapidKey = getVapidKey(state);

  return {
    dropdownMenuIsOpen: state.getIn(['dropdown_menu', 'openId']) !== null,
    accessToken: getAccessToken(state),
    streamingUrl: state.getIn(['instance', 'urls', 'streaming_api']),
    me,
    account,
    features: getFeatures(instance),
    soapbox,
    vapidKey,
  };
};

const keyMap = {
  help: '?',
  new: 'n',
  search: 's',
  forceNew: 'option+n',
  reply: 'r',
  favourite: 'f',
  react: 'e',
  boost: 'b',
  mention: 'm',
  open: ['enter', 'o'],
  openProfile: 'p',
  moveDown: ['down', 'j'],
  moveUp: ['up', 'k'],
  back: 'backspace',
  goToHome: 'g h',
  goToNotifications: 'g n',
  goToFavourites: 'g f',
  goToPinned: 'g p',
  goToProfile: 'g u',
  goToBlocked: 'g b',
  goToMuted: 'g m',
  goToRequests: 'g r',
  toggleHidden: 'x',
  toggleSensitive: 'h',
  openMedia: 'a',
};

class SwitchingColumnsArea extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    onLayoutChange: PropTypes.func.isRequired,
    soapbox: ImmutablePropTypes.map.isRequired,
    features: PropTypes.object.isRequired,
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
    const { children, soapbox, features } = this.props;
    const authenticatedProfile = soapbox.get('authenticatedProfile');
    const hasCrypto = soapbox.get('cryptoAddresses').size > 0;

    return (
      <Switch>
        <WrappedRoute path='/auth/external' component={ExternalLogin} publicRoute exact />
        <WrappedRoute path='/auth/mfa' page={DefaultPage} component={MfaForm} exact />
        <WrappedRoute path='/auth/confirmation' page={EmptyPage} component={EmailConfirmation} publicRoute exact />

        <WrappedRoute path='/' exact page={HomePage} component={HomeTimeline} content={children} />

        // NOTE: we cannot nest routes in a fragment
        // https://stackoverflow.com/a/68637108
        {features.federating && <WrappedRoute path='/timeline/local' exact page={HomePage} component={CommunityTimeline} content={children} publicRoute />}
        {features.federating && <WrappedRoute path='/timeline/fediverse' exact page={HomePage} component={PublicTimeline} content={children} publicRoute />}
        {features.federating && <WrappedRoute path='/timeline/:instance' exact page={RemoteInstancePage} component={RemoteTimeline} content={children} />}

        <WrappedRoute path='/conversations' page={DefaultPage} component={Conversations} content={children} componentParams={{ shouldUpdateScroll: this.shouldUpdateScroll }} />
        <WrappedRoute path='/messages' page={DefaultPage} component={features.directTimeline ? DirectTimeline : Conversations} content={children} componentParams={{ shouldUpdateScroll: this.shouldUpdateScroll }} />

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

        {/* Redirects from Mastodon, Pleroma FE, etc. to fix old bookmarks */}
        <Redirect from='/web/:path1/:path2/:path3' to='/:path1/:path2/:path3' />
        <Redirect from='/web/:path1/:path2' to='/:path1/:path2' />
        <Redirect from='/web/:path' to='/:path' />
        <Redirect from='/timelines/home' to='/' />
        <Redirect from='/timelines/public/local' to='/timeline/local' />
        <Redirect from='/timelines/public' to='/timeline/fediverse' />
        <Redirect from='/timelines/direct' to='/messages' />
        <Redirect from='/main/all' to='/timeline/fediverse' />
        <Redirect from='/main/public' to='/timeline/local' />
        <Redirect from='/main/friends' to='/' />
        <Redirect from='/tag/:id' to='/tags/:id' />
        <Redirect from='/user-settings' to='/settings/profile' />
        <WrappedRoute path='/notice/:statusId' publicRoute exact page={DefaultPage} component={Status} content={children} />
        <Redirect from='/users/:username/statuses/:statusId' to='/@:username/posts/:statusId' />
        <Redirect from='/users/:username/chats' to='/chats' />
        <Redirect from='/users/:username' to='/@:username' />
        <Redirect from='/terms' to='/about' />
        <Redirect from='/home' to='/' />

        {/* Soapbox Legacy redirects */}
        <Redirect from='/canary' to='/about/canary' />
        <Redirect from='/canary.txt' to='/about/canary' />

        <WrappedRoute path='/tags/:id' publicRoute page={DefaultPage} component={HashtagTimeline} content={children} />

        {features.lists && <WrappedRoute path='/lists' page={DefaultPage} component={Lists} content={children} />}
        {features.lists && <WrappedRoute path='/list/:id' page={HomePage} component={ListTimeline} content={children} />}
        {features.bookmarks && <WrappedRoute path='/bookmarks' page={DefaultPage} component={Bookmarks} content={children} />}

        <WrappedRoute path='/notifications' page={DefaultPage} component={Notifications} content={children} />

        <WrappedRoute path='/search' publicRoute page={DefaultPage} component={Search} content={children} />
        {features.suggestions && <WrappedRoute path='/suggestions' publicRoute page={DefaultPage} component={FollowRecommendations} content={children} />}
        {features.profileDirectory && <WrappedRoute path='/directory' publicRoute page={DefaultPage} component={Directory} content={children} />}

        {features.chats && <WrappedRoute path='/chats' exact page={DefaultPage} component={ChatIndex} content={children} />}
        {features.chats && <WrappedRoute path='/chats/:chatId' page={DefaultPage} component={ChatRoom} content={children} />}

        <WrappedRoute path='/follow_requests' page={DefaultPage} component={FollowRequests} content={children} />
        <WrappedRoute path='/blocks' page={DefaultPage} component={Blocks} content={children} />
        {features.federating && <WrappedRoute path='/domain_blocks' page={DefaultPage} component={DomainBlocks} content={children} />}
        <WrappedRoute path='/mutes' page={DefaultPage} component={Mutes} content={children} />
        {features.filters && <WrappedRoute path='/filters' page={DefaultPage} component={Filters} content={children} />}
        <WrappedRoute path='/@:username' publicRoute exact component={AccountTimeline} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/with_replies' publicRoute={!authenticatedProfile} component={AccountTimeline} page={ProfilePage} content={children} componentParams={{ withReplies: true }} />
        <WrappedRoute path='/@:username/followers' publicRoute={!authenticatedProfile} component={Followers} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/following' publicRoute={!authenticatedProfile} component={Following} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/media' publicRoute={!authenticatedProfile} component={AccountGallery} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/tagged/:tag' exact component={AccountTimeline} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/favorites' component={FavouritedStatuses} page={ProfilePage} content={children}  />
        <WrappedRoute path='/@:username/pins' component={PinnedStatuses} page={ProfilePage} content={children} />
        <WrappedRoute path='/@:username/posts/:statusId' publicRoute exact page={StatusPage} component={Status} content={children} />
        <Redirect from='/@:username/:statusId' to='/@:username/posts/:statusId' />

        <WrappedRoute path='/statuses/new' page={DefaultPage} component={NewStatus} content={children} exact />
        <WrappedRoute path='/statuses/:statusId' exact component={Status} content={children} componentParams={{ shouldUpdateScroll: this.shouldUpdateScroll }} />
        {features.scheduledStatuses && <WrappedRoute path='/scheduled_statuses' page={DefaultPage} component={ScheduledStatuses} content={children} />}

        <Redirect from='/registration/:token' to='/invite/:token' />
        <Redirect from='/registration' to='/' />
        <WrappedRoute path='/invite/:token' component={RegisterInvite} content={children} publicRoute />

        <Redirect from='/auth/edit' to='/settings' />
        <Redirect from='/settings/preferences' to='/settings' />
        <Redirect from='/auth/password/new' to='/reset-password' />
        <Redirect from='/auth/password/edit' to='/edit-password' />
        <WrappedRoute path='/settings/profile' page={DefaultPage} component={EditProfile} content={children} />
        {/* <WrappedRoute path='/settings/export' page={DefaultPage} component={ExportData} content={children} /> */}
        {/* <WrappedRoute path='/settings/import' page={DefaultPage} component={ImportData} content={children} /> */}
        {features.accountAliasesAPI && <WrappedRoute path='/settings/aliases' page={DefaultPage} component={Aliases} content={children} />}
        {features.accountMoving && <WrappedRoute path='/settings/migration' page={DefaultPage} component={Migration} content={children} />}
        <WrappedRoute path='/settings/email' page={DefaultPage} component={EditEmail} content={children} />
        <WrappedRoute path='/settings/password' page={DefaultPage} component={EditPassword} content={children} />
        <WrappedRoute path='/settings/account' page={DefaultPage} component={DeleteAccount} content={children} />
        <WrappedRoute path='/settings/media_display' page={DefaultPage} component={MediaDisplay} content={children} />
        <WrappedRoute path='/settings' page={DefaultPage} component={Settings} content={children} />
        {/* <WrappedRoute path='/backups' page={DefaultPage} component={Backups} content={children} /> */}
        <WrappedRoute path='/soapbox/config' adminOnly page={DefaultPage} component={SoapboxConfig} content={children} />

        <Redirect from='/admin/dashboard' to='/admin' exact />
        <WrappedRoute path='/admin' staffOnly page={AdminPage} component={Dashboard} content={children} exact />
        <WrappedRoute path='/admin/approval' staffOnly page={AdminPage} component={AwaitingApproval} content={children} exact />
        <WrappedRoute path='/admin/reports' staffOnly page={AdminPage} component={Reports} content={children} exact />
        <WrappedRoute path='/admin/log' staffOnly page={AdminPage} component={ModerationLog} content={children} exact />
        <WrappedRoute path='/admin/users' staffOnly page={AdminPage} component={UserIndex} content={children} exact />
        <WrappedRoute path='/info' page={EmptyPage} component={ServerInfo} content={children} />

        <WrappedRoute path='/developers/apps/create' developerOnly page={DefaultPage} component={CreateApp} content={children} />
        <WrappedRoute path='/developers/settings_store' developerOnly page={DefaultPage} component={SettingsStore} content={children} />
        <WrappedRoute path='/developers' page={DefaultPage} component={Developers} content={children} />
        <WrappedRoute path='/error' page={EmptyPage} component={IntentionalError} content={children} />

        {hasCrypto && <WrappedRoute path='/donate/crypto' publicRoute page={DefaultPage} component={CryptoDonate} content={children} />}
        {features.federating && <WrappedRoute path='/federation_restrictions' publicRoute page={DefaultPage} component={FederationRestrictions} content={children} />}

        <WrappedRoute path='/share' page={DefaultPage} component={Share} content={children} exact />

        <WrappedRoute page={EmptyPage} component={GenericNotFound} content={children} />
      </Switch>
    );
  }

}

export default @connect(mapStateToProps)
@injectIntl
@withRouter
class UI extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node,
    location: PropTypes.object,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    dropdownMenuIsOpen: PropTypes.bool,
    me: SoapboxPropTypes.me,
    streamingUrl: PropTypes.string,
    account: PropTypes.object,
    features: PropTypes.object.isRequired,
    soapbox: ImmutablePropTypes.map.isRequired,
    vapidKey: PropTypes.string,
  };

  state = {
    draggingOver: false,
    mobile: isMobile(window.innerWidth),
  };

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
      // Do nothing
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
      this.props.dispatch(uploadCompose(e.dataTransfer.files, this.props.intl));
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
      this.props.history.push(data.path);
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

  // Load initial data when a user is logged in
  loadAccountData = () => {
    const { account, features, dispatch } = this.props;

    dispatch(expandHomeTimeline());

    dispatch(expandNotifications())
      .then(() => dispatch(fetchMarker(['notifications'])))
      .catch(console.error);

    if (features.chats) {
      dispatch(fetchChats());
    }

    if (isStaff(account)) {
      dispatch(fetchReports({ state: 'open' }));
      dispatch(fetchUsers(['local', 'need_approval']));
    }

    if (isAdmin(account)) {
      dispatch(fetchConfig());
    }

    setTimeout(() => dispatch(fetchFilters()), 500);

    if (account.locked) {
      setTimeout(() => dispatch(fetchFollowRequests()), 700);
    }

    setTimeout(() => dispatch(fetchScheduledStatuses()), 900);
  }

  componentDidMount() {
    const { account, vapidKey, dispatch } = this.props;

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
      this.loadAccountData();
      dispatch(fetchCustomEmojis());
    }

    this.connectStreaming();

    if (vapidKey) {
      dispatch(registerPushNotifications());
    }
  }

  componentDidUpdate(prevProps) {
    this.connectStreaming();

    const { dispatch, account, features, vapidKey } = this.props;

    // The user has logged in
    if (account && !prevProps.account) {
      this.loadAccountData();
    // The instance has loaded
    } else if (account && features.chats && !prevProps.features.chats) {
      dispatch(fetchChats());
    }

    if (vapidKey && !prevProps.vapidKey) {
      dispatch(registerPushNotifications());
    }
  }

  componentWillUnmount() {
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
    if (!this.node) return;

    const element = this.node.querySelector('textarea#compose-textarea');

    if (element) {
      element.focus();
    }
  }

  handleHotkeySearch = e => {
    e.preventDefault();
    if (!this.node) return;

    const element = this.node.querySelector('input#search');

    if (element) {
      element.focus();
    }
  }

  handleHotkeyForceNew = e => {
    this.handleHotkeyNew(e);
    this.props.dispatch(resetCompose());
  }

  handleHotkeyBack = () => {
    if (window.history && window.history.length === 1) {
      this.props.history.push('/');
    } else {
      this.props.history.goBack();
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
    this.props.history.push('/');
  }

  handleHotkeyGoToNotifications = () => {
    this.props.history.push('/notifications');
  }

  handleHotkeyGoToFavourites = () => {
    const { account } = this.props;
    if (!account) return;

    this.props.history.push(`/@${account.get('username')}/favorites`);
  }

  handleHotkeyGoToPinned = () => {
    const { account } = this.props;
    if (!account) return;

    this.props.history.push(`/@${account.get('username')}/pins`);
  }

  handleHotkeyGoToProfile = () => {
    const { account } = this.props;
    if (!account) return;

    this.props.history.push(`/@${account.get('username')}`);
  }

  handleHotkeyGoToBlocked = () => {
    this.props.history.push('/blocks');
  }

  handleHotkeyGoToMuted = () => {
    this.props.history.push('/mutes');
  }

  handleHotkeyGoToRequests = () => {
    this.props.history.push('/follow_requests');
  }

  handleOpenComposeModal = () => {
    this.props.dispatch(openModal('COMPOSE'));
  }

  shouldHideFAB = () => {
    const path = this.props.location.pathname;
    return path.match(/^\/posts\/|^\/search|^\/getting-started|^\/chats/);
  }

  isChatRoomLocation = () => {
    const path = this.props.location.pathname;
    return path.match(/^\/chats\/(.*)/);
  }

  render() {
    const { features, soapbox } = this.props;
    const { draggingOver, mobile } = this.state;
    const { intl, children, location, dropdownMenuIsOpen, me } = this.props;

    // Wait for login to succeed or fail
    if (me === null) return null;

    const handlers = me ? {
      help: this.handleHotkeyToggleHelp,
      new: this.handleHotkeyNew,
      search: this.handleHotkeySearch,
      forceNew: this.handleHotkeyForceNew,
      back: this.handleHotkeyBack,
      goToHome: this.handleHotkeyGoToHome,
      goToNotifications: this.handleHotkeyGoToNotifications,
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
        <Icon src={require('icons/pen-plus.svg')} />
      </button>
    );

    const floatingActionButton = this.shouldHideFAB() ? null : fabElem;

    const style = {
      pointerEvents: dropdownMenuIsOpen ? 'none' : null,
    };

    return (
      <HotKeys keyMap={keyMap} handlers={handlers} ref={this.setHotkeysRef} attach={window} focused>
        <div ref={this.setRef} style={style}>
          <BackgroundShapes />

          <div className='z-10 flex flex-col'>
            <PreHeader />
            <Navbar />

            <SwitchingColumnsArea location={location} onLayoutChange={this.handleLayoutChange} soapbox={soapbox} features={features}>
              {children}
            </SwitchingColumnsArea>

            {me && floatingActionButton}

            <BundleContainer fetchComponent={NotificationsContainer}>
              {Component => <Component />}
            </BundleContainer>

            <BundleContainer fetchComponent={ModalContainer}>
              {Component => <Component />}
            </BundleContainer>

            <BundleContainer fetchComponent={UploadArea}>
              {Component => <Component active={draggingOver} onClose={this.closeUploadModal} />}
            </BundleContainer>

            {me && (
              <BundleContainer fetchComponent={SidebarMenu}>
                {Component => <Component />}
              </BundleContainer>
            )}
            {me && features.chats && !mobile && (
              <BundleContainer fetchComponent={ChatPanes}>
                {Component => <Component />}
              </BundleContainer>
            )}
            <ThumbNavigation />

            <BundleContainer fetchComponent={ProfileHoverCard}>
              {Component => <Component />}
            </BundleContainer>
          </div>
        </div>
      </HotKeys>
    );
  }

}

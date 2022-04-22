import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import {
  fetchAccount,
  fetchAccountByUsername,
} from 'soapbox/actions/accounts';
import { openModal } from 'soapbox/actions/modals';
import Column from 'soapbox/components/column';
import LoadMore from 'soapbox/components/load_more';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import MissingIndicator from 'soapbox/components/missing_indicator';
import SubNavigation from 'soapbox/components/sub_navigation';
import { getAccountGallery, findAccountByUsername } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

import { expandAccountMediaTimeline } from '../../actions/timelines';

import MediaItem from './components/media_item';

const mapStateToProps = (state, { params, withReplies = false }) => {
  const username = params.username || '';
  const me = state.get('me');
  const accountFetchError = ((state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase());
  const features = getFeatures(state.get('instance'));

  let accountId = -1;
  let accountUsername = username;
  if (accountFetchError) {
    accountId = null;
  } else {
    const account = findAccountByUsername(state, username);
    accountId = account ? account.getIn(['id'], null) : -1;
    accountUsername = account ? account.getIn(['acct'], '') : '';
  }

  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
  const unavailable = (me === accountId) ? false : (isBlocked && !features.blockersVisible);

  return {
    accountId,
    unavailable,
    accountUsername,
    isAccount: !!state.getIn(['accounts', accountId]),
    attachments: getAccountGallery(state, accountId),
    isLoading: state.getIn(['timelines', `account:${accountId}:media`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${accountId}:media`, 'hasMore']),
  };
};

class LoadMoreMedia extends ImmutablePureComponent {

  static propTypes = {
    maxId: PropTypes.string,
    onLoadMore: PropTypes.func.isRequired,
  };

  handleLoadMore = () => {
    this.props.onLoadMore(this.props.maxId);
  }

  render() {
    return (
      <LoadMore
        disabled={this.props.disabled}
        onClick={this.handleLoadMore}
      />
    );
  }

}

export default @connect(mapStateToProps)
class AccountGallery extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    attachments: ImmutablePropTypes.list.isRequired,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
  };

  state = {
    width: 323,
  };

  componentDidMount() {
    const { params: { username }, accountId } = this.props;

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchAccount(accountId));
      this.props.dispatch(expandAccountMediaTimeline(accountId));
    } else {
      this.props.dispatch(fetchAccountByUsername(username));
    }
  }

  componentDidUpdate(prevProps) {
    const { accountId, params } = this.props;
    if (accountId && accountId !== -1 && (accountId !== prevProps.accountId && accountId)) {
      this.props.dispatch(fetchAccount(params.accountId));
      this.props.dispatch(expandAccountMediaTimeline(accountId));
    }
  }

  handleScrollToBottom = () => {
    if (this.props.hasMore) {
      this.handleLoadMore(this.props.attachments.size > 0 ? this.props.attachments.last().getIn(['status', 'id']) : undefined);
    }
  }

  handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const offset = scrollHeight - scrollTop - clientHeight;

    if (150 > offset && !this.props.isLoading) {
      this.handleScrollToBottom();
    }
  }

  handleLoadMore = maxId => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(this.props.accountId, { maxId }));
    }
  };

  handleLoadOlder = e => {
    e.preventDefault();
    this.handleScrollToBottom();
  }

  handleOpenMedia = attachment => {
    if (attachment.get('type') === 'video') {
      this.props.dispatch(openModal('VIDEO', { media: attachment, status: attachment.get('status'), account: attachment.get('account') }));
    } else {
      const media = attachment.getIn(['status', 'media_attachments']);
      const index = media.findIndex(x => x.get('id') === attachment.get('id'));

      this.props.dispatch(openModal('MEDIA', { media, index, status: attachment.get('status'), account: attachment.get('account') }));
    }
  }

  handleRef = c => {
    if (c) {
      this.setState({ width: c.offsetWidth });
    }
  }

  render() {
    const { attachments, isLoading, hasMore, isAccount, accountId, unavailable, accountUsername } = this.props;
    const { width } = this.state;

    if (!isAccount && accountId !== -1) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    if (accountId === -1 || (!attachments && isLoading)) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    let loadOlder = null;

    if (hasMore && !(isLoading && attachments.size === 0)) {
      loadOlder = <LoadMore visible={!isLoading} onClick={this.handleLoadOlder} />;
    }

    if (unavailable) {
      return (
        <Column>
          <div className='empty-column-indicator'>
            <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />
          </div>
        </Column>
      );
    }

    return (
      <Column>
        <SubNavigation message={`@${accountUsername}`} />
        <div className='slist slist--flex' onScroll={this.handleScroll}>
          <div className='account__section-headline'>
            <div style={{ width: '100%', display: 'flex' }}>
              <NavLink exact to={`/@${accountUsername}`}>
                <FormattedMessage id='account.posts' defaultMessage='Posts' />
              </NavLink>
              <NavLink exact to={`/@${accountUsername}/with_replies`}>
                <FormattedMessage id='account.posts_with_replies' defaultMessage='Posts and replies' />
              </NavLink>
              <NavLink exact to={`/@${accountUsername}/media`}>
                <FormattedMessage id='account.media' defaultMessage='Media' />
              </NavLink>
            </div>
          </div>

          <div role='feed' className='account-gallery__container' ref={this.handleRef}>
            {attachments.map((attachment, index) => attachment === null ? (
              <LoadMoreMedia key={'more:' + attachments.getIn(index + 1, 'id')} maxId={index > 0 ? attachments.getIn(index - 1, 'id') : null} onLoadMore={this.handleLoadMore} />
            ) : (
              <MediaItem
                key={`${attachment.getIn(['status', 'id'])}+${attachment.get('id')}`}
                attachment={attachment}
                displayWidth={width}
                onOpenMedia={this.handleOpenMedia}
              />
            ))}

            {
              attachments.size === 0 &&
              <div className='empty-column-indicator'>
                <FormattedMessage id='account_gallery.none' defaultMessage='No media to show.' />
              </div>
            }

            {loadOlder}
          </div>

          {isLoading && attachments.size === 0 && (
            <div className='slist__append'>
              <LoadingIndicator />
            </div>
          )}
        </div>
      </Column>
    );
  }

}

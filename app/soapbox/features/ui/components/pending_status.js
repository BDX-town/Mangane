import classNames from 'classnames';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import StatusContent from 'soapbox/components/status_content';
import PlaceholderCard from 'soapbox/features/placeholder/components/placeholder_card';
import { getDomain } from 'soapbox/utils/accounts';

import PlaceholderMediaGallery from '../../placeholder/components/placeholder_media_gallery';
import { buildStatus } from '../util/pending_status_builder';

import PollPreview from './poll_preview';

const shouldHaveCard = pendingStatus => {
  return Boolean(pendingStatus.get('content').match(/https?:\/\/\S*/));
};

const mapStateToProps = (state, props) => {
  const { idempotencyKey } = props;
  const pendingStatus = state.getIn(['pending_statuses', idempotencyKey]);
  return {
    status: pendingStatus ? buildStatus(state, pendingStatus, idempotencyKey) : null,
  };
};

export default @connect(mapStateToProps)
class PendingStatus extends ImmutablePureComponent {

  renderMedia = () => {
    const { status } = this.props;

    if (status.get('media_attachments') && !status.get('media_attachments').isEmpty()) {
      return (
        <PlaceholderMediaGallery
          media={status.get('media_attachments')}
        />
      );
    } else if (shouldHaveCard(status)) {
      return <PlaceholderCard />;
    } else {
      return null;
    }
  }

  render() {
    const { status, className } = this.props;
    if (!status) return null;
    if (!status.get('account')) return null;

    const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    const domain = getDomain(status.get('account'));

    return (
      <div className={classNames('pending-status', className)}>
        <div className={classNames('status__wrapper', `status__wrapper-${status.get('visibility')}`, { 'status__wrapper-reply': !!status.get('in_reply_to_id') })} tabIndex={this.props.muted ? null : 0}>
          <div className={classNames('status', `status-${status.get('visibility')}`, { 'status-reply': !!status.get('in_reply_to_id'), muted: this.props.muted })} data-id={status.get('id')}>
            <div className='status__expand' onClick={this.handleExpandClick} role='presentation' />
            <div className='status__info'>
              <span className='status__relative-time'>
                <RelativeTimestamp timestamp={status.get('created_at')} />
              </span>

              {favicon &&
                <div className='status__favicon'>
                  <Link to={`/timeline/${domain}`}>
                    <img src={favicon} alt='' title={domain} />
                  </Link>
                </div>}

              <div className='status__profile'>
                <div className='status__avatar'>
                  <NavLink to={`/@${status.getIn(['account', 'acct'])}`} title={status.getIn(['account', 'acct'])}>
                    <Avatar account={status.get('account')} size={48} />
                  </NavLink>
                </div>
                <NavLink to={`/@${status.getIn(['account', 'acct'])}`} title={status.getIn(['account', 'acct'])} className='status__display-name'>
                  <DisplayName account={status.get('account')} />
                </NavLink>
              </div>
            </div>

            <StatusContent
              status={status}
              expanded
              collapsable
            />

            {this.renderMedia()}
            {status.get('poll') && <PollPreview poll={status.get('poll')} />}

            {/* TODO */}
            {/* <PlaceholderActionBar /> */}
          </div>
        </div>
      </div>
    );
  }

}

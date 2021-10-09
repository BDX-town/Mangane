import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import StatusContent from 'soapbox/components/status_content';
import { buildStatus } from '../util/pending_status_builder';
import classNames from 'classnames';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import { Link, NavLink } from 'react-router-dom';
import { getDomain } from 'soapbox/utils/accounts';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import PollPreview from './poll_preview';

const mapStateToProps = (state, props) => {
  const { idempotencyKey } = props;
  const pendingStatus = state.getIn(['pending_statuses', idempotencyKey]);
  return {
    status: pendingStatus ? buildStatus(state, pendingStatus, idempotencyKey) : null,
  };
};

export default @connect(mapStateToProps)
class PendingStatus extends ImmutablePureComponent {

  render() {
    const { status, showThread } = this.props;
    if (!status) return null;
    if (!status.get('account')) return null;

    const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    const domain = getDomain(status.get('account'));

    return (
      <div className='pending-status'>
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

            <AttachmentThumbs
              compact
              media={status.get('media_attachments')}
            />

            {status.get('poll') && <PollPreview poll={status.get('poll')} />}

            {showThread && status.get('in_reply_to_id') && status.get('in_reply_to_account_id') === status.getIn(['account', 'id']) && (
              <button className='status__content__read-more-button' onClick={this.handleClick}>
                <FormattedMessage id='status.show_thread' defaultMessage='Show thread' />
              </button>
            )}

            {/* TODO */}
            {/* <PlaceholderActionBar /> */}
          </div>
        </div>
      </div>
    );
  }

}

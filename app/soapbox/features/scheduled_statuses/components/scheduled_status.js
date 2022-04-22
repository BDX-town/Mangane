import classNames from 'classnames';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import StatusContent from 'soapbox/components/status_content';
import StatusReplyMentions from 'soapbox/components/status_reply_mentions';
import PollPreview from 'soapbox/features/ui/components/poll_preview';
import { getDomain } from 'soapbox/utils/accounts';

import { buildStatus } from '../builder';

import ScheduledStatusActionBar from './scheduled_status_action_bar';

const mapStateToProps = (state, props) => {
  const scheduledStatus = state.getIn(['scheduled_statuses', props.statusId]);
  return {
    status: buildStatus(state, scheduledStatus),
  };
};

export default @connect(mapStateToProps)
class ScheduledStatus extends ImmutablePureComponent {

  render() {
    const { status, account, ...other } = this.props;
    if (!status.get('account')) return null;

    const statusUrl = `/scheduled_statuses/${status.get('id')}`;
    const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    const domain = getDomain(status.get('account'));

    return (
      <div className='scheduled-status'>
        <div className={classNames('status__wrapper', `status__wrapper-${status.get('visibility')}`, { 'status__wrapper-reply': !!status.get('in_reply_to_id') })} tabIndex={this.props.muted ? null : 0}>
          <div className={classNames('status', `status-${status.get('visibility')}`, { 'status-reply': !!status.get('in_reply_to_id'), muted: this.props.muted })} data-id={status.get('id')}>
            <div className='status__expand' role='presentation' />
            <div className='status__info'>
              <NavLink to={statusUrl} className='status__relative-time'>
                <RelativeTimestamp timestamp={status.get('created_at')} futureDate />
              </NavLink>

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

            <StatusReplyMentions status={status} />

            <StatusContent
              status={status}
              expanded
              collapsable
            />

            {status.get('media_attachments').size > 0 && (
              <AttachmentThumbs
                compact
                media={status.get('media_attachments')}
                sensitive={status.get('sensitive')}
              />
            )}

            {status.get('poll') && <PollPreview poll={status.get('poll')} />}

            <ScheduledStatusActionBar status={status} account={account} {...other} />
          </div>
        </div>
      </div>
    );
  }

}

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import StatusContent from 'soapbox/components/status_content';
import { buildStatus } from '../builder';
import classNames from 'classnames';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import { Link, NavLink } from 'react-router-dom';
import { getDomain } from 'soapbox/utils/accounts';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import AttachmentList from 'soapbox/components/attachment_list';
import PollPreview from './poll_preview';
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
    const { status, showThread, account, ...other } = this.props;
    if (!status.get('account')) return null;

    const statusUrl = `/scheduled_statuses/${status.get('id')}`;
    const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    const domain = getDomain(status.get('account'));

    return (
      <div className='scheduled-status'>
        <div className={classNames('status__wrapper', `status__wrapper-${status.get('visibility')}`, { 'status__wrapper-reply': !!status.get('in_reply_to_id') })} tabIndex={this.props.muted ? null : 0}>
          <div className={classNames('status', `status-${status.get('visibility')}`, { 'status-reply': !!status.get('in_reply_to_id'), muted: this.props.muted })} data-id={status.get('id')}>
            <div className='status__expand' onClick={this.handleExpandClick} role='presentation' />
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

            <StatusContent
              status={status}
              expanded
              collapsable
            />

            <AttachmentList
              compact
              media={status.get('media_attachments')}
            />

            {status.get('poll') && <PollPreview poll={status.get('poll')} />}

            {showThread && status.get('in_reply_to_id') && status.get('in_reply_to_account_id') === status.getIn(['account', 'id']) && (
              <button className='status__content__read-more-button' onClick={this.handleClick}>
                <FormattedMessage id='status.show_thread' defaultMessage='Show thread' />
              </button>
            )}

            <ScheduledStatusActionBar status={status} account={account} {...other} />
          </div>
        </div>
      </div>
    );
  }

}

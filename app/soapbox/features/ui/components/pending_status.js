import classNames from 'classnames';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import StatusContent from 'soapbox/components/status_content';
import StatusReplyMentions from 'soapbox/components/status_reply_mentions';
import { HStack } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import PlaceholderCard from 'soapbox/features/placeholder/components/placeholder_card';
import PlaceholderMediaGallery from 'soapbox/features/placeholder/components/placeholder_media_gallery';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';

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
@injectIntl
class PendingStatus extends ImmutablePureComponent {

  renderMedia = () => {
    const { status } = this.props;

    if (status.get('media_attachments') && !status.get('media_attachments').isEmpty()) {
      return (
        <PlaceholderMediaGallery
          media={status.get('media_attachments')}
        />
      );
    } else if (!status.get('quote') && shouldHaveCard(status)) {
      return <PlaceholderCard />;
    } else {
      return null;
    }
  }

  render() {
    const { status, className } = this.props;
    if (!status) return null;
    if (!status.get('account')) return null;

    return (
      <div className={classNames('opacity-50', className)}>
        <div className={classNames('status', { 'status-reply': !!status.get('in_reply_to_id'), muted: this.props.muted })} data-id={status.get('id')}>
          <div className={classNames('status__wrapper', `status-${status.get('visibility')}`, { 'status-reply': !!status.get('in_reply_to_id') })} tabIndex={this.props.muted ? null : 0}>
            <div className='mb-4'>
              <HStack justifyContent='between' alignItems='start'>
                <AccountContainer
                  key={String(status.getIn(['account', 'id']))}
                  id={String(status.getIn(['account', 'id']))}
                  timestamp={status.created_at}
                  timestampUrl={status.get('created_at')}
                  hideActions
                />
              </HStack>
            </div>

            <div className='status__content-wrapper'>
              <StatusReplyMentions status={status} />

              <StatusContent
                status={status}
                expanded
                collapsable
              />

              {this.renderMedia()}
              {status.get('poll') && <PollPreview poll={status.get('poll')} />}

              {status.get('quote') && <QuotedStatus statusId={status.get('quote')} />}
            </div>

            {/* TODO */}
            {/* <PlaceholderActionBar /> */}
          </div>
        </div>
      </div>
    );
  }

}

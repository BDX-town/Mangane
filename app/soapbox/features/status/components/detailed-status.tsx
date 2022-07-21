import classNames from 'classnames';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedDate, FormattedMessage, injectIntl, WrappedComponentProps as IntlProps } from 'react-intl';

import Icon from 'soapbox/components/icon';
import StatusMedia from 'soapbox/components/status-media';
import StatusReplyMentions from 'soapbox/components/status-reply-mentions';
import StatusContent from 'soapbox/components/status_content';
import { HStack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import scheduleIdleTask from 'soapbox/features/ui/util/schedule_idle_task';

import StatusInteractionBar from './status-interaction-bar';

import type { List as ImmutableList } from 'immutable';
import type { Attachment as AttachmentEntity, Status as StatusEntity } from 'soapbox/types/entities';

interface IDetailedStatus extends IntlProps {
  status: StatusEntity,
  onOpenMedia: (media: ImmutableList<AttachmentEntity>, index: number) => void,
  onOpenVideo: (media: ImmutableList<AttachmentEntity>, start: number) => void,
  onToggleHidden: (status: StatusEntity) => void,
  measureHeight: boolean,
  onHeightChange: () => void,
  domain: string,
  compact: boolean,
  showMedia: boolean,
  onOpenCompareHistoryModal: (status: StatusEntity) => void,
  onToggleMediaVisibility: () => void,
}

interface IDetailedStatusState {
  height: number | null,
}

class DetailedStatus extends ImmutablePureComponent<IDetailedStatus, IDetailedStatusState> {

  state = {
    height: null,
  };

  node: HTMLDivElement | null = null;

  handleExpandedToggle = () => {
    this.props.onToggleHidden(this.props.status);
  }

  handleOpenCompareHistoryModal = () => {
    this.props.onOpenCompareHistoryModal(this.props.status);
  }

  _measureHeight(heightJustChanged = false) {
    if (this.props.measureHeight && this.node) {
      scheduleIdleTask(() => this.node && this.setState({ height: Math.ceil(this.node.scrollHeight) + 1 }));

      if (this.props.onHeightChange && heightJustChanged) {
        this.props.onHeightChange();
      }
    }
  }

  setRef: React.RefCallback<HTMLDivElement> = c => {
    this.node = c;
    this._measureHeight();
  }

  componentDidUpdate(prevProps: IDetailedStatus, prevState: IDetailedStatusState) {
    this._measureHeight(prevState.height !== this.state.height);
  }

  // handleModalLink = e => {
  //   e.preventDefault();
  //
  //   let href;
  //
  //   if (e.target.nodeName !== 'A') {
  //     href = e.target.parentNode.href;
  //   } else {
  //     href = e.target.href;
  //   }
  //
  //   window.open(href, 'soapbox-intent', 'width=445,height=600,resizable=no,menubar=no,status=no,scrollbars=yes');
  // }

  getActualStatus = () => {
    const { status } = this.props;
    if (!status) return undefined;
    return status.reblog && typeof status.reblog === 'object' ? status.reblog : status;
  }

  render() {
    const status = this.getActualStatus();
    if (!status) return null;
    const { account } = status;
    if (!account || typeof account !== 'object') return null;

    const outerStyle: React.CSSProperties = { boxSizing: 'border-box' };
    const { compact } = this.props;

    let statusTypeIcon = null;

    if (this.props.measureHeight) {
      outerStyle.height = `${this.state.height}px`;
    }

    let quote;

    if (status.quote) {
      if (status.pleroma.get('quote_visible', true) === false) {
        quote = (
          <div className='quoted-status-tombstone'>
            <p><FormattedMessage id='statuses.quote_tombstone' defaultMessage='Post is unavailable.' /></p>
          </div>
        );
      } else {
        quote = <QuotedStatus statusId={status.quote as string} />;
      }
    }

    if (status.visibility === 'direct') {
      statusTypeIcon = <Icon src={require('@tabler/icons/mail.svg')} />;
    } else if (status.visibility === 'private') {
      statusTypeIcon = <Icon src={require('@tabler/icons/lock.svg')} />;
    }

    return (
      <div style={outerStyle}>
        <div ref={this.setRef} className={classNames('detailed-status', { compact })} tabIndex={-1}>
          <div className='mb-4'>
            <AccountContainer
              key={account.id}
              id={account.id}
              timestamp={status.created_at}
              avatarSize={42}
              hideActions
            />
          </div>

          {/* status.group && (
            <div className='status__meta'>
              Posted in <NavLink to={`/groups/${status.getIn(['group', 'id'])}`}>{status.getIn(['group', 'title'])}</NavLink>
            </div>
          )*/}

          <StatusReplyMentions status={status} />

          <StatusContent
            status={status}
            expanded={!status.hidden}
            onExpandedToggle={this.handleExpandedToggle}
          />

          <StatusMedia
            status={status}
            showMedia={this.props.showMedia}
            onToggleVisibility={this.props.onToggleMediaVisibility}
          />

          {quote}

          <HStack justifyContent='between' alignItems='center' className='py-2'>
            <StatusInteractionBar status={status} />

            <div className='detailed-status__timestamp'>
              {statusTypeIcon}

              <span>
                <a href={status.url} target='_blank' rel='noopener' className='hover:underline'>
                  <Text tag='span' theme='muted' size='sm'>
                    <FormattedDate value={new Date(status.created_at)} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
                  </Text>
                </a>

                {status.edited_at && (
                  <>
                    {' · '}
                    <div
                      className='inline hover:underline'
                      onClick={this.handleOpenCompareHistoryModal}
                      role='button'
                      tabIndex={0}
                    >
                      <Text tag='span' theme='muted' size='sm'>
                        <FormattedMessage id='status.edited' defaultMessage='Edited {date}' values={{ date: this.props.intl.formatDate(new Date(status.edited_at), { hour12: false, month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }} />
                      </Text>
                    </div>
                  </>
                )}
              </span>
            </div>
          </HStack>
        </div>
      </div>
    );
  }

}

export default injectIntl(DetailedStatus);

import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage, IntlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';

import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import { Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';

import type { Account as AccountEntity, Status as StatusEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  cancel: { id: 'reply_indicator.cancel', defaultMessage: 'Cancel' },
});

interface IQuotedStatus {
  status?: StatusEntity,
  onCancel?: Function,
  intl: IntlShape,
  compose?: boolean,
  history: History,
}

class QuotedStatus extends ImmutablePureComponent<IQuotedStatus> {

  handleExpandClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { compose, status } = this.props;

    if (!status) return;

    const account = status.account as AccountEntity;

    if (!compose && e.button === 0) {
      if (!this.props.history) {
        return;
      }

      this.props.history.push(`/@${account.acct}/posts/${status.id}`);

      e.stopPropagation();
      e.preventDefault();
    }
  }

  handleClose = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  renderReplyMentions = () => {
    const { status } = this.props;

    if (!status?.in_reply_to_id) {
      return null;
    }

    const account = status.account as AccountEntity;

    const to = status.mentions || [];

    if (to.size === 0) {
      if (status.in_reply_to_account_id === account.id) {
        return (
          <div className='reply-mentions'>
            <FormattedMessage
              id='reply_mentions.reply'
              defaultMessage='Replying to {accounts}{more}'
              values={{
                accounts: `@${account.username}`,
                more: false,
              }}
            />
          </div>
        );
      } else {
        return (
          <div className='reply-mentions'>
            <FormattedMessage id='reply_mentions.reply_empty' defaultMessage='Replying to post' />
          </div>
        );
      }
    }

    return (
      <div className='reply-mentions'>
        <FormattedMessage
          id='reply_mentions.reply'
          defaultMessage='Replying to {accounts}{more}'
          values={{
            accounts: to.slice(0, 2).map(account => `@${account.username} `),
            more: to.size > 2 && <FormattedMessage id='reply_mentions.more' defaultMessage='and {count} more' values={{ count: to.size - 2 }} />,
          }}
        />
      </div>
    );
  }

  render() {
    const { status, onCancel, intl, compose } = this.props;

    if (!status) {
      return null;
    }

    const account = status.account as AccountEntity;

    let actions = {};
    if (onCancel) {
      actions = {
        onActionClick: this.handleClose,
        actionIcon: require('@tabler/icons/icons/x.svg'),
        actionAlignment: 'top',
        actionTitle: intl.formatMessage(messages.cancel),
      };
    }

    const quotedStatus = (
      <Stack
        space={2}
        className={classNames('mt-3 p-4 rounded-lg border border-solid border-gray-100 dark:border-slate-700 cursor-pointer', {
          'hover:bg-gray-100 dark:hover:bg-slate-700': !compose,
        })}
        onClick={this.handleExpandClick}
      >
        <AccountContainer
          {...actions}
          id={account.id}
          timestamp={status.created_at}
          withRelationship={false}
          showProfileHoverCard={!compose}
        />

        {this.renderReplyMentions()}

        <Text
          className='break-words'
          size='sm'
          dangerouslySetInnerHTML={{ __html: status.contentHtml }}
        />

        {status.media_attachments.size > 0 && (
          <AttachmentThumbs
            compact
            media={status.media_attachments}
            sensitive={status.sensitive}
          />
        )}
      </Stack>
    );

    return quotedStatus;
  }

}

export default withRouter(injectIntl(QuotedStatus) as any);

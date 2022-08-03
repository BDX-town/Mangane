import classNames from 'classnames';
import React, { useState } from 'react';
import { defineMessages, useIntl, FormattedMessage, FormattedList } from 'react-intl';
import { useHistory } from 'react-router-dom';

import StatusMedia from 'soapbox/components/status-media';
import { Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useSettings } from 'soapbox/hooks';
import { defaultMediaVisibility } from 'soapbox/utils/status';

import type { Account as AccountEntity, Status as StatusEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  cancel: { id: 'reply_indicator.cancel', defaultMessage: 'Cancel' },
});

interface IQuotedStatus {
  /** The quoted status entity. */
  status?: StatusEntity,
  /** Callback when cancelled (during compose). */
  onCancel?: Function,
  /** Whether the status is shown in the post composer. */
  compose?: boolean,
}

/** Status embedded in a quote post. */
const QuotedStatus: React.FC<IQuotedStatus> = ({ status, onCancel, compose }) => {
  const intl = useIntl();
  const history = useHistory();

  const settings = useSettings();
  const displayMedia = settings.get('displayMedia');

  const [showMedia, setShowMedia] = useState<boolean>(defaultMediaVisibility(status, displayMedia));

  const handleExpandClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!status) return;
    const account = status.account as AccountEntity;

    if (!compose && e.button === 0) {
      history.push(`/@${account.acct}/posts/${status.id}`);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleToggleMediaVisibility = () => {
    setShowMedia(!showMedia);
  };

  const renderReplyMentions = () => {
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
              defaultMessage='Replying to {accounts}'
              values={{
                accounts: `@${account.username}`,
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

    const accounts = to.slice(0, 2).map(account => <>@{account.username}</>).toArray();

    if (to.size > 2) {
      accounts.push(
        <FormattedMessage id='reply_mentions.more' defaultMessage='{count} more' values={{ count: to.size - 2 }} />,
      );
    }

    return (
      <div className='reply-mentions'>
        <FormattedMessage
          id='reply_mentions.reply'
          defaultMessage='Replying to {accounts}'
          values={{
            accounts: <FormattedList type='conjunction' value={accounts} />,
          }}
        />
      </div>
    );
  };

  if (!status) {
    return null;
  }

  const account = status.account as AccountEntity;

  let actions = {};
  if (onCancel) {
    actions = {
      onActionClick: handleClose,
      actionIcon: require('@tabler/icons/x.svg'),
      actionAlignment: 'top',
      actionTitle: intl.formatMessage(messages.cancel),
    };
  }

  return (
    <Stack
      data-testid='quoted-status'
      space={2}
      className={classNames('mt-3 p-4 rounded-lg border border-solid border-gray-100 dark:border-gray-800 cursor-pointer', {
        'hover:bg-gray-50 dark:hover:bg-gray-800': !compose,
      })}
      onClick={handleExpandClick}
    >
      <AccountContainer
        {...actions}
        id={account.id}
        timestamp={status.created_at}
        withRelationship={false}
        showProfileHoverCard={!compose}
        withLinkToProfile={!compose}
      />

      {renderReplyMentions()}

      <Text
        className='break-words status__content status__content--quote'
        size='sm'
        dangerouslySetInnerHTML={{ __html: status.contentHtml }}
      />

      <StatusMedia
        status={status}
        muted={compose}
        showMedia={showMedia}
        onToggleVisibility={handleToggleMediaVisibility}
      />
    </Stack>
  );
};

export default QuotedStatus;

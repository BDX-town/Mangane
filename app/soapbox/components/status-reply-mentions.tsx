import React from 'react';
import { FormattedList, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modals';
import HoverStatusWrapper from 'soapbox/components/hover-status-wrapper';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import { useAppDispatch } from 'soapbox/hooks';

import type { Account, Status } from 'soapbox/types/entities';

interface IStatusReplyMentions {
  status: Status,
  hoverable?: boolean,
}

const StatusReplyMentions: React.FC<IStatusReplyMentions> = ({ status, hoverable = true }) => {
  const dispatch = useAppDispatch();

  const handleOpenMentionsModal: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();

    const account = status.account as Account;

    dispatch(openModal('MENTIONS', {
      username: account.acct,
      statusId: status.id,
    }));
  };

  if (!status.in_reply_to_id) {
    return null;
  }

  const to = status.mentions;

  // The post is a reply, but it has no mentions.
  // Rare, but it can happen.
  if (to.size === 0) {
    return (
      <div className='reply-mentions'>
        <FormattedMessage
          id='reply_mentions.reply_empty'
          defaultMessage='Replying to post'
        />
      </div>
    );
  }

  // The typical case with a reply-to and a list of mentions.
  const accounts = to.slice(0, 2).map(account => {
    const link = (
      <Link to={`/@${account.acct}`} className='reply-mentions__account'>@{account.username}</Link>
    );

    if (hoverable) {
      return (
        <HoverRefWrapper key={account.id} accountId={account.id} inline>
          {link}
        </HoverRefWrapper>
      );
    } else {
      return link;
    }
  }).toArray();

  if (to.size > 2) {
    accounts.push(
      <span key='more' className='hover:underline cursor-pointer' role='presentation' onClick={handleOpenMentionsModal}>
        <FormattedMessage id='reply_mentions.more' defaultMessage='{count} more' values={{ count: to.size - 2 }} />
      </span>,
    );
  }

  return (
    <div className='reply-mentions'>
      <FormattedMessage
        id='reply_mentions.reply'
        defaultMessage='<hover>Replying to</hover> {accounts}'
        values={{
          accounts: <FormattedList type='conjunction' value={accounts} />,
          hover: (children: React.ReactNode) => {
            if (hoverable) {
              return (
                <HoverStatusWrapper statusId={status.in_reply_to_id} inline>
                  <span
                    key='hoverstatus'
                    className='hover:underline cursor-pointer'
                    role='presentation'
                  >
                    {children}
                  </span>
                </HoverStatusWrapper>
              );
            } else {
              return children;
            }
          },
        }}
      />
    </div>
  );
};

export default StatusReplyMentions;

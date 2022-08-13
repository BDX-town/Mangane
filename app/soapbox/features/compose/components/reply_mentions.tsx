import React from 'react';
import { FormattedList, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { useAppSelector } from 'soapbox/hooks';
import { statusToMentionsAccountIdsArray } from 'soapbox/reducers/compose';
import { makeGetStatus } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

import type { Status as StatusEntity } from 'soapbox/types/entities';

const ReplyMentions: React.FC = () => {
  const dispatch = useDispatch();
  const instance = useAppSelector((state) => state.instance);
  const status = useAppSelector<StatusEntity | null>(state => makeGetStatus()(state, { id: state.compose.in_reply_to! }));

  const to = useAppSelector((state) => state.compose.to);
  const account = useAppSelector((state) => state.accounts.get(state.me));

  const { explicitAddressing } = getFeatures(instance);

  if (!explicitAddressing || !status || !to) {
    return null;
  }

  const parentTo = status && statusToMentionsAccountIdsArray(status, account!);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    dispatch(openModal('REPLY_MENTIONS'));
  };

  if (!parentTo || (parentTo.size === 0)) {
    return null;
  }

  if (to.size === 0) {
    return (
      <a href='#' className='reply-mentions' onClick={handleClick}>
        <FormattedMessage
          id='reply_mentions.reply_empty'
          defaultMessage='Replying to post'
        />
      </a>
    );
  }

  const accounts = to.slice(0, 2).map((acct: string) => (
    <span className='reply-mentions__account'>@{acct.split('@')[0]}</span>
  )).toArray();

  if (to.size > 2) {
    accounts.push(
      <FormattedMessage id='reply_mentions.more' defaultMessage='{count} more' values={{ count: to.size - 2 }} />,
    );
  }

  return (
    <a href='#' className='reply-mentions' onClick={handleClick}>
      <FormattedMessage
        id='reply_mentions.reply'
        defaultMessage='Replying to {accounts}'
        values={{
          accounts: <FormattedList type='conjunction' value={accounts} />,
        }}
      />
    </a>
  );
};

export default ReplyMentions;

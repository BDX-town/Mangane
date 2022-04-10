import React from 'react';
import { FormattedMessage } from 'react-intl';
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
  const status = useAppSelector<StatusEntity | null>(state => makeGetStatus()(state, { id: state.compose.get('in_reply_to') }));

  const to = useAppSelector((state) => state.compose.get('to'));
  const account = useAppSelector((state) => state.accounts.get(state.me));

  const { explicitAddressing } = getFeatures(instance);

  if (!explicitAddressing || !status || !to) {
    return null;
  }

  const parentTo = status && statusToMentionsAccountIdsArray(status, account);

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

  return (
    <a href='#' className='reply-mentions' onClick={handleClick}>
      <FormattedMessage
        id='reply_mentions.reply'
        defaultMessage='Replying to {accounts}{more}'
        values={{
          accounts: to.slice(0, 2).map((acct: string) => <><span className='reply-mentions__account'>@{acct.split('@')[0]}</span>{' '}</>),
          more: to.size > 2 && <FormattedMessage id='reply_mentions.more' defaultMessage='and {count} more' values={{ count: to.size - 2 }} />,
        }}
      />
    </a>
  );
};

export default ReplyMentions;

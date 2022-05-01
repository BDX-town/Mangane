import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';
import { statusToMentionsAccountIdsArray } from 'soapbox/reducers/compose';
import { makeGetStatus } from 'soapbox/selectors';

import Account from '../../reply_mentions/account';

import type { Account as AccountEntity, Status as StatusEntity } from 'soapbox/types/entities';

interface IReplyMentionsModal {
  onClose: (string: string) => void,
}

const ReplyMentionsModal: React.FC<IReplyMentionsModal> = ({ onClose }) => {
  const status = useAppSelector<StatusEntity | null>(state => makeGetStatus()(state, { id: state.compose.get('in_reply_to') }));
  const account = useAppSelector((state) => state.accounts.get(state.me));

  const mentions = statusToMentionsAccountIdsArray(status, account);
  const author = (status?.account as AccountEntity).id;

  const onClickClose = () => {
    onClose('REPLY_MENTIONS');
  };

  return (
    <Modal
      title={<FormattedMessage id='navigation_bar.in_reply_to' defaultMessage='In reply to' />}
      onClose={onClickClose}
    >
      <div className='reply-mentions-modal__accounts'>
        {mentions.map(accountId => <Account key={accountId} accountId={accountId} added author={author === accountId} />)}
      </div>
    </Modal>
  );
};

export default ReplyMentionsModal;

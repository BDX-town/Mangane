import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { fetchAccount } from 'soapbox/actions/accounts';
import { addToMentions, removeFromMentions } from 'soapbox/actions/compose';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display-name';
import IconButton from 'soapbox/components/icon_button';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const messages = defineMessages({
  remove: { id: 'reply_mentions.account.remove', defaultMessage: 'Remove from mentions' },
  add: { id: 'reply_mentions.account.add', defaultMessage: 'Add to mentions' },
});

const getAccount = makeGetAccount();

interface IAccount {
  accountId: string,
  author: boolean,
}

const Account: React.FC<IAccount> = ({ accountId, author }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) => getAccount(state, accountId));
  const added = useAppSelector((state) => !!account && state.compose.to?.includes(account.acct));

  const onRemove = () => dispatch(removeFromMentions(accountId));
  const onAdd = () => dispatch(addToMentions(accountId));

  useEffect(() => {
    if (accountId && !account) {
      dispatch(fetchAccount(accountId));
    }
  }, []);

  if (!account) return null;

  let button;

  if (added) {
    button = <IconButton src={require('@tabler/icons/x.svg')} title={intl.formatMessage(messages.remove)} onClick={onRemove} />;
  } else {
    button = <IconButton src={require('@tabler/icons/plus.svg')} title={intl.formatMessage(messages.add)} onClick={onAdd} />;
  }

  return (
    <div className='account'>
      <div className='account__wrapper'>
        <div className='account__display-name'>
          <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
          <DisplayName account={account} />
        </div>

        <div className='account__relationship'>
          {!author && button}
        </div>
      </div>
    </div>
  );
};

export default Account;

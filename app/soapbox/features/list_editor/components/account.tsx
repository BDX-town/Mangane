import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { removeFromListEditor, addToListEditor } from 'soapbox/actions/lists';
import DisplayName from 'soapbox/components/display-name';
import IconButton from 'soapbox/components/icon_button';
import { Avatar } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const messages = defineMessages({
  remove: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  add: { id: 'lists.account.add', defaultMessage: 'Add to list' },
});

const getAccount = makeGetAccount();

interface IAccount {
  accountId: string,
}

const Account: React.FC<IAccount> = ({ accountId }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) => getAccount(state, accountId));
  const isAdded = useAppSelector((state) => state.listEditor.accounts.items.includes(accountId));

  const onRemove = () => dispatch(removeFromListEditor(accountId));
  const onAdd = () => dispatch(addToListEditor(accountId));

  if (!account) return null;

  let button;

  if (isAdded) {
    button = <IconButton src={require('@tabler/icons/x.svg')} title={intl.formatMessage(messages.remove)} onClick={onRemove} />;
  } else {
    button = <IconButton src={require('@tabler/icons/plus.svg')} title={intl.formatMessage(messages.add)} onClick={onAdd} />;
  }

  return (
    <div className='account'>
      <div className='account__wrapper'>
        <div className='account__display-name'>
          <div className='account__avatar-wrapper'><Avatar src={account.avatar} size={36} /></div>
          <DisplayName account={account} />
        </div>

        <div className='account__relationship'>
          {button}
        </div>
      </div>
    </div>
  );
};

export default Account;

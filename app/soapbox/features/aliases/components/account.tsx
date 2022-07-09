import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { addToAliases } from 'soapbox/actions/aliases';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display-name';
import IconButton from 'soapbox/components/icon_button';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

import type { List as ImmutableList } from 'immutable';

const messages = defineMessages({
  add: { id: 'aliases.account.add', defaultMessage: 'Create alias' },
});

const getAccount = makeGetAccount();

interface IAccount {
  accountId: string,
  aliases: ImmutableList<string>
}

const Account: React.FC<IAccount> = ({ accountId, aliases }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) => getAccount(state, accountId));
  const added = useAppSelector((state) => {
    const instance = state.instance;
    const features = getFeatures(instance);

    const account = getAccount(state, accountId);
    const apId = account?.pleroma.get('ap_id');
    const name = features.accountMoving ? account?.acct : apId;

    return aliases.includes(name);
  });
  const me = useAppSelector((state) => state.me);

  const handleOnAdd = () => dispatch(addToAliases(account!));

  if (!account) return null;

  let button;

  if (!added && accountId !== me) {
    button = (
      <div className='account__relationship'>
        <IconButton src={require('@tabler/icons/plus.svg')} title={intl.formatMessage(messages.add)} onClick={handleOnAdd} />
      </div>
    );
  }

  return (
    <div className='account'>
      <div className='account__wrapper'>
        <div className='account__display-name'>
          <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
          <DisplayName account={account} />
        </div>

        {button}
      </div>
    </div>
  );
};

export default Account;

import React from 'react';

import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import Permalink from 'soapbox/components/permalink';
import ActionButton from 'soapbox/features/ui/components/action-button';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const getAccount = makeGetAccount();

const getFirstSentence = (str: string) => {
  const arr = str.split(/(([.?!]+\s)|[．。？！\n•])/);

  return arr[0];
};

interface IAccount {
  id: string,
}

const Account: React.FC<IAccount> = ({ id }) => {
  const account = useAppSelector((state) => getAccount(state, id));

  if (!account) return null;

  return (
    <div className='account follow-recommendations-account'>
      <div className='account__wrapper'>
        <Permalink className='account__display-name account__display-name--with-note' title={account.acct} href={account.url} to={`/@${account.get('acct')}`}>
          <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>

          <DisplayName account={account} />

          <div className='account__note'>{getFirstSentence(account.get('note_plain'))}</div>
        </Permalink>

        <div className='account__relationship'>
          <ActionButton account={account} />
        </div>
      </div>
    </div>
  );
};

export default Account;

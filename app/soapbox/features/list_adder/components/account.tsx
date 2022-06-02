import React from 'react';

import DisplayName from 'soapbox/components/display-name';
import { Avatar } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const getAccount = makeGetAccount();

interface IAccount {
  accountId: string,
}

const Account: React.FC<IAccount> = ({ accountId }) => {
  const account = useAppSelector((state) => getAccount(state, accountId));

  if (!account) return null;

  return (
    <div className='account'>
      <div className='account__wrapper'>
        <div className='account__display-name'>
          <div className='account__avatar-wrapper'><Avatar src={account.avatar} size={36} /></div>
          <DisplayName account={account} />
        </div>
      </div>
    </div>
  );
};

export default Account;

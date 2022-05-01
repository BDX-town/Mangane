import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import Icon from 'soapbox/components/icon';
import Permalink from 'soapbox/components/permalink';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const messages = defineMessages({
  birthday: { id: 'account.birthday', defaultMessage: 'Born {date}' },
});

const getAccount = makeGetAccount();

interface IAccount {
  accountId: string,
}

const Account: React.FC<IAccount> = ({ accountId }) => {
  const intl = useIntl();
  const account = useAppSelector((state) => getAccount(state, accountId));

  // useEffect(() => {
  //   if (accountId && !account) {
  //     fetchAccount(accountId);
  //   }
  // }, [accountId]);

  if (!account) return null;

  const birthday = account.get('birthday');
  if (!birthday) return null;

  const formattedBirthday = intl.formatDate(birthday, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className='account'>
      <div className='account__wrapper'>
        <Permalink className='account__display-name' title={account.get('acct')} href={`/@${account.get('acct')}`} to={`/@${account.get('acct')}`}>
          <div className='account__display-name'>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
            <DisplayName account={account} />

          </div>
        </Permalink>
        <div
          className='flex items-center gap-0.5'
          title={intl.formatMessage(messages.birthday, {
            date: formattedBirthday,
          })}
        >
          <Icon src={require('@tabler/icons/icons/ballon.svg')} />
          {formattedBirthday}
        </div>
      </div>
    </div>
  );
};

export default Account;

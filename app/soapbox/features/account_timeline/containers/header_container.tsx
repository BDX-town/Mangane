import React from 'react';

import Header from 'soapbox/features/account/components/header';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

import MovedNote from '../components/moved_note';

const getAccount = makeGetAccount();

interface IHeaderContainer {
  accountId: string,
}

/**
 * Legacy account Header container, accepting an accountId instead of an account.
 * @deprecated Use account Header directly.
 */
const HeaderContainer: React.FC<IHeaderContainer> = ({ accountId }) => {
  const account = useAppSelector(state => getAccount(state, accountId));

  if (account) {
    return (
      <>
        {(account.moved && typeof account.moved === 'object') && (
          <MovedNote from={account} to={account.moved} />
        )}
        <Header account={account} />
      </>
    );
  } else {
    return null;
  }
};

export default HeaderContainer;

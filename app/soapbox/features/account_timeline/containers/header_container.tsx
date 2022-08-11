import React from 'react';

import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

import Header from '../components/header';

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
    return <Header account={account} />;
  } else {
    return null;
  }
};

export default HeaderContainer;

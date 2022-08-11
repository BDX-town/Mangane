import React from 'react';

import InnerHeader from 'soapbox/features/account/components/header';

import MovedNote from './moved_note';

import type { Account } from 'soapbox/types/entities';

interface IHeader {
  account?: Account,
}

/**
 * Legacy account header middleman component that exists for no reason.
 * @deprecated Use account Header directly.
 */
const Header: React.FC<IHeader> = ({ account }) => {
  if (!account) {
    return null;
  }

  return (
    <>
      {(account.moved && typeof account.moved === 'object') && (
        <MovedNote from={account} to={account.moved} />
      )}
      <InnerHeader account={account} />
    </>
  );
};

export default Header;

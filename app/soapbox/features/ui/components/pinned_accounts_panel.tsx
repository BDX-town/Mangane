import { List as ImmutableList } from 'immutable';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchPinnedAccounts } from 'soapbox/actions/accounts';
import { Widget } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import type { Account } from 'soapbox/types/entities';

interface IPinnedAccountsPanel {
  account: Account,
  limit: number,
}

const PinnedAccountsPanel: React.FC<IPinnedAccountsPanel> = ({ account, limit }) => {
  const dispatch = useAppDispatch();
  const pinned = useAppSelector((state) => state.user_lists.getIn(['pinned', account.id, 'items'], ImmutableList())).slice(0, limit);

  useEffect(() => {
    dispatch(fetchPinnedAccounts(account.id));
  }, []);

  if (pinned.isEmpty()) {
    return null;
  }

  return (
    <Widget
      title={<FormattedMessage
        id='pinned_accounts.title'
        defaultMessage='{name}’s choices'
        values={{
          name: <span className='display-name__html' dangerouslySetInnerHTML={{ __html: account.display_name_html }} />,
        }}
      />}
    >
      {pinned && pinned.map((suggestion: string) => (
        <AccountContainer
          key={suggestion}
          id={suggestion}
          withRelationship={false}
        />
      ))}
    </Widget>
  );
};

export default PinnedAccountsPanel;

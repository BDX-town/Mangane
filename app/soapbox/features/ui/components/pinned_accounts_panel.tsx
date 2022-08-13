import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchPinnedAccounts } from 'soapbox/actions/accounts';
import { Widget } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { WhoToFollowPanel } from 'soapbox/features/ui/util/async-components';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import type { Account } from 'soapbox/types/entities';

interface IPinnedAccountsPanel {
  account: Account,
  limit: number,
}

const PinnedAccountsPanel: React.FC<IPinnedAccountsPanel> = ({ account, limit }) => {
  const dispatch = useAppDispatch();
  const pinned = useAppSelector((state) => state.user_lists.pinned.get(account.id)?.items || ImmutableOrderedSet<string>()).slice(0, limit);

  useEffect(() => {
    dispatch(fetchPinnedAccounts(account.id));
  }, []);

  if (pinned.isEmpty()) {
    return (
      <BundleContainer fetchComponent={WhoToFollowPanel}>
        {Component => <Component limit={limit} />}
      </BundleContainer>
    );
  }

  return (
    <Widget
      title={<FormattedMessage
        id='pinned_accounts.title'
        defaultMessage='{name}’s choices'
        values={{
          name: <span dangerouslySetInnerHTML={{ __html: account.display_name_html }} />,
        }}
      />}
    >
      {pinned && pinned.map((suggestion) => (
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

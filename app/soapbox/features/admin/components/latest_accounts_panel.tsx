import { OrderedSet as ImmutableOrderedSet, is } from 'immutable';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { fetchUsers } from 'soapbox/actions/admin';
import compareId from 'soapbox/compare_id';
import { Text, Widget } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch';

const messages = defineMessages({
  title: { id: 'admin.latest_accounts_panel.title', defaultMessage: 'Latest Accounts' },
  expand: { id: 'admin.latest_accounts_panel.expand_message', defaultMessage: 'Click to see {count} more {count, plural, one {account} other {accounts}}' },
});

interface ILatestAccountsPanel {
  limit?: number,
}

const LatestAccountsPanel: React.FC<ILatestAccountsPanel> = ({ limit = 5 }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const accountIds = useAppSelector<ImmutableOrderedSet<string>>((state) => state.admin.get('latestUsers'));
  const hasDates = useAppSelector((state) => accountIds.every(id => !!state.accounts.getIn([id, 'created_at'])));

  const [total, setTotal] = useState(0);

  useEffect(() => {
    dispatch(fetchUsers(['local', 'active'], 1, null, limit))
      .then((value) => {
        setTotal((value as { count: number }).count);
      })
      .catch(() => {});
  }, []);

  const sortedIds = accountIds.sort(compareId).reverse();
  const isSorted  = hasDates && is(accountIds, sortedIds);

  if (!isSorted || !accountIds || accountIds.isEmpty()) {
    return null;
  }

  const expandCount = total - accountIds.size;

  return (
    <Widget title={intl.formatMessage(messages.title)}>
      {accountIds.take(limit).map((account) => (
        <AccountContainer key={account} id={account} withRelationship={false} />
      ))}
      {!!expandCount && (
        <Link className='wtf-panel__expand-btn' to='/admin/users'>
          <Text>{intl.formatMessage(messages.expand, { count: expandCount })}</Text>
        </Link>
      )}
    </Widget>
  );
};

export default LatestAccountsPanel;

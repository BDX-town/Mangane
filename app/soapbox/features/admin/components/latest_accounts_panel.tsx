import { OrderedSet as ImmutableOrderedSet, is } from 'immutable';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { fetchUsers } from 'soapbox/actions/admin';
import compareId from 'soapbox/compare_id';
import { Widget } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';
import { useAppDispatch } from 'soapbox/hooks';

const messages = defineMessages({
  title: { id: 'admin.latest_accounts_panel.title', defaultMessage: 'Latest Accounts' },
  expand: { id: 'admin.latest_accounts_panel.more', defaultMessage: 'Click to see {count} {count, plural, one {account} other {accounts}}' },
});

interface ILatestAccountsPanel {
  limit?: number,
}

const LatestAccountsPanel: React.FC<ILatestAccountsPanel> = ({ limit = 5 }) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const accountIds = useAppSelector<ImmutableOrderedSet<string>>((state) => state.admin.get('latestUsers').take(limit));
  const hasDates = useAppSelector((state) => accountIds.every(id => !!state.accounts.getIn([id, 'created_at'])));

  const [total, setTotal] = useState(accountIds.size);

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

  const handleAction = () => {
    history.push('/soapbox/admin/users');
  };

  return (
    <Widget
      title={intl.formatMessage(messages.title)}
      onActionClick={handleAction}
      actionTitle={intl.formatMessage(messages.expand, { count: total })}
    >
      {accountIds.take(limit).map((account) => (
        <AccountContainer key={account} id={account} withRelationship={false} withDate />
      ))}
    </Widget>
  );
};

export default LatestAccountsPanel;

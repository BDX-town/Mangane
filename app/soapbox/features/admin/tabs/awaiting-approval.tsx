import React, { useState, useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { fetchUsers } from 'soapbox/actions/admin';
import ScrollableList from 'soapbox/components/scrollable_list';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

import UnapprovedAccount from '../components/unapproved_account';

const messages = defineMessages({
  heading: { id: 'column.admin.awaiting_approval', defaultMessage: 'Awaiting Approval' },
  emptyMessage: { id: 'admin.awaiting_approval.empty_message', defaultMessage: 'There is nobody waiting for approval. When a new user signs up, you can review them here.' },
});

const AwaitingApproval: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const accountIds = useAppSelector(state => state.admin.awaitingApproval);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchUsers(['local', 'need_approval']))
      .then(() => setLoading(false))
      .catch(() => {});
  }, []);

  const showLoading = isLoading && accountIds.count() === 0;

  return (
    <ScrollableList
      isLoading={isLoading}
      showLoading={showLoading}
      scrollKey='awaiting-approval'
      emptyMessage={intl.formatMessage(messages.emptyMessage)}
    >
      {accountIds.map(id => (
        <UnapprovedAccount accountId={id} key={id} />
      ))}
    </ScrollableList>
  );
};

export default AwaitingApproval;

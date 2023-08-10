import debounce from 'lodash/debounce';
import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchFollowRequests, expandFollowRequests } from 'soapbox/actions/accounts';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Spinner } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/column';

import AccountAuthorize from './components/account_authorize';

const messages = defineMessages({
  heading: { id: 'column.follow_requests', defaultMessage: 'Follow requests' },
});

const handleLoadMore = debounce((dispatch) => {
  dispatch(expandFollowRequests());
}, 300, { leading: true });

const FollowRequests: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const accountIds = useAppSelector((state) => state.user_lists.follow_requests.items);
  const hasMore = useAppSelector((state) => !!state.user_lists.follow_requests.next);
  const loading = useAppSelector((state) => state.user_lists.mutes.isLoading);

  React.useEffect(() => {
    dispatch(fetchFollowRequests());
  }, []);

  const emptyMessage = <FormattedMessage id='empty_column.follow_requests' defaultMessage="You don't have any follow requests yet. When you receive one, it will show up here." />;

  return (
    <Column icon='user-plus' label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        className='flex flex-col gap-3'
        scrollKey='follow_requests'
        onLoadMore={() => handleLoadMore(dispatch)}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
      >
        {accountIds.map(id =>
          <AccountAuthorize key={id} id={id} />,
        )}
        {
          loading && <Spinner />
        }
      </ScrollableList>
    </Column>
  );
};

export default FollowRequests;

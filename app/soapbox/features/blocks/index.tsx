import debounce from 'lodash/debounce';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchBlocks, expandBlocks } from 'soapbox/actions/blocks';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Column, Spinner } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  heading: { id: 'column.blocks', defaultMessage: 'Blocked users' },
});

const handleLoadMore = debounce((dispatch) => {
  dispatch(expandBlocks());
}, 300, { leading: true });

const Blocks: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const accountIds = useAppSelector((state) => state.user_lists.blocks.items);
  const hasMore = useAppSelector((state) => !!state.user_lists.blocks.next);
  const loading = useAppSelector((state) => state.user_lists.blocks.isLoading);

  React.useEffect(() => {
    dispatch(fetchBlocks());
  }, []);

  const emptyMessage = <FormattedMessage id='empty_column.blocks' defaultMessage="You haven't blocked any users yet." />;

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey='blocks'
        onLoadMore={() => handleLoadMore(dispatch)}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
        itemClassName='flex flex-col gap-3 pb-4'
      >
        {accountIds.map((id) =>
          <AccountContainer key={id} id={id} actionType='blocking' />,
        )}
        {
          loading && <Spinner />
        }
      </ScrollableList>

    </Column>
  );
};

export default Blocks;

import { debounce } from 'lodash';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import SubNavigation from 'soapbox/components/sub_navigation';
import { Column } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import { fetchBookmarkedStatuses, expandBookmarkedStatuses } from '../../actions/bookmarks';
import StatusList from '../../components/status_list';

const messages = defineMessages({
  heading: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
});

const handleLoadMore = debounce((dispatch) => {
  dispatch(expandBookmarkedStatuses());
}, 300, { leading: true });

const Bookmarks: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const statusIds = useAppSelector((state) => state.status_lists.getIn(['bookmarks', 'items']));
  const isLoading = useAppSelector((state) => state.status_lists.getIn(['bookmarks', 'isLoading'], true));
  const hasMore = useAppSelector((state) => !!state.status_lists.getIn(['bookmarks', 'next']));

  React.useEffect(() => {
    dispatch(fetchBookmarkedStatuses());
  }, []);

  const handleRefresh = () => {
    return dispatch(fetchBookmarkedStatuses());
  };

  const emptyMessage = <FormattedMessage id='empty_column.bookmarks' defaultMessage="You don't have any bookmarks yet. When you add one, it will show up here." />;

  return (
    <Column transparent>
      <div className='px-4 pt-4 sm:p-0'>
        <SubNavigation message={intl.formatMessage(messages.heading)} />
      </div>
      <StatusList
        statusIds={statusIds}
        scrollKey={'bookmarked_statuses'}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={() => handleLoadMore(dispatch)}
        onRefresh={handleRefresh}
        emptyMessage={emptyMessage}
        divideType='space'
      />
    </Column>
  );
};

export default Bookmarks;

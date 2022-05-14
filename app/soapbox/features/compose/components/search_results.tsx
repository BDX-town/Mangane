import classNames from 'classnames';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { defineMessages, useIntl } from 'react-intl';

import { expandSearch, setFilter } from 'soapbox/actions/search';
import { fetchTrendingStatuses } from 'soapbox/actions/trending_statuses';
import ScrollableList from 'soapbox/components/scrollable_list';
import PlaceholderAccount from 'soapbox/features/placeholder/components/placeholder_account';
import PlaceholderHashtag from 'soapbox/features/placeholder/components/placeholder_hashtag';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

import Hashtag from '../../../components/hashtag';
import { Tabs } from '../../../components/ui';
import AccountContainer from '../../../containers/account_container';
import StatusContainer from '../../../containers/status_container';

import type {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';

const messages = defineMessages({
  accounts: { id: 'search_results.accounts', defaultMessage: 'People' },
  statuses: { id: 'search_results.statuses', defaultMessage: 'Posts' },
  hashtags: { id: 'search_results.hashtags', defaultMessage: 'Hashtags' },
});

type SearchFilter = 'accounts' | 'statuses' | 'hashtags';

/** Displays search results depending on the active tab. */
const SearchResults: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const value = useAppSelector(state => state.search.submittedValue);
  const results = useAppSelector(state => state.search.results);
  const suggestions = useAppSelector(state => state.suggestions.items);
  const trendingStatuses = useAppSelector(state => state.trending_statuses.items);
  const trends = useAppSelector(state => state.trends.items);
  const submitted = useAppSelector(state => state.search.submitted);
  const selectedFilter = useAppSelector(state => state.search.filter);

  const handleLoadMore = () => dispatch(expandSearch(selectedFilter));
  const handleSelectFilter = (newActiveFilter: SearchFilter) => dispatch(setFilter(newActiveFilter));

  useEffect(() => {
    dispatch(fetchTrendingStatuses());
  }, []);

  const renderFilterBar = () => {
    const items = [
      {
        text: intl.formatMessage(messages.accounts),
        action: () => handleSelectFilter('accounts'),
        name: 'accounts',
      },
      {
        text: intl.formatMessage(messages.statuses),
        action: () => handleSelectFilter('statuses'),
        name: 'statuses',
      },
      {
        text: intl.formatMessage(messages.hashtags),
        action: () => handleSelectFilter('hashtags'),
        name: 'hashtags',
      },
    ];

    return <Tabs items={items} activeItem={selectedFilter} />;
  };

  let searchResults;
  let hasMore = false;
  let loaded;
  let noResultsMessage;
  let placeholderComponent: React.ComponentType<any> = PlaceholderStatus;

  if (selectedFilter === 'accounts') {
    hasMore = results.get('accountsHasMore');
    loaded = results.get('accountsLoaded');
    placeholderComponent = PlaceholderAccount;

    if (results.get('accounts') && results.get('accounts').size > 0) {
      searchResults = results.get('accounts').map((accountId: string) => <AccountContainer key={accountId} id={accountId} />);
    } else if (!submitted && suggestions && !suggestions.isEmpty()) {
      searchResults = suggestions.map(suggestion => <AccountContainer key={suggestion.get('account')} id={suggestion.get('account')} />);
    } else if (loaded) {
      noResultsMessage = (
        <div className='empty-column-indicator'>
          <FormattedMessage
            id='empty_column.search.accounts'
            defaultMessage='There are no people results for "{term}"'
            values={{ term: value }}
          />
        </div>
      );
    }
  }

  if (selectedFilter === 'statuses') {
    hasMore = results.get('statusesHasMore');
    loaded = results.get('statusesLoaded');

    if (results.get('statuses') && results.get('statuses').size > 0) {
      searchResults = results.get('statuses').map((statusId: string) => (
        // @ts-ignore
        <StatusContainer key={statusId} id={statusId} />
      ));
    } else if (!submitted && trendingStatuses && !trendingStatuses.isEmpty()) {
      searchResults = trendingStatuses.map(statusId => (
        // @ts-ignore
        <StatusContainer key={statusId} id={statusId} />
      ));
    } else if (loaded) {
      noResultsMessage = (
        <div className='empty-column-indicator'>
          <FormattedMessage
            id='empty_column.search.statuses'
            defaultMessage='There are no posts results for "{term}"'
            values={{ term: value }}
          />
        </div>
      );
    }
  }

  if (selectedFilter === 'hashtags') {
    hasMore = results.get('hashtagsHasMore');
    loaded = results.get('hashtagsLoaded');
    placeholderComponent = PlaceholderHashtag;

    if (results.get('hashtags') && results.get('hashtags').size > 0) {
      searchResults = results.get('hashtags').map((hashtag: ImmutableMap<string, any>) => <Hashtag key={hashtag.get('name')} hashtag={hashtag} />);
    } else if (!submitted && suggestions && !suggestions.isEmpty()) {
      searchResults = trends.map(hashtag => <Hashtag key={hashtag.get('name')} hashtag={hashtag} />);
    } else if (loaded) {
      noResultsMessage = (
        <div className='empty-column-indicator'>
          <FormattedMessage
            id='empty_column.search.hashtags'
            defaultMessage='There are no hashtags results for "{term}"'
            values={{ term: value }}
          />
        </div>
      );
    }
  }

  return (
    <>
      {renderFilterBar()}

      {noResultsMessage || (
        <ScrollableList
          key={selectedFilter}
          scrollKey={`${selectedFilter}:${value}`}
          isLoading={submitted && !loaded}
          showLoading={submitted && !loaded && results.isEmpty()}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          placeholderComponent={placeholderComponent}
          placeholderCount={20}
          className={classNames({
            'divide-gray-200 dark:divide-slate-700 divide-solid divide-y': selectedFilter === 'statuses',
          })}
          itemClassName={classNames({ 'pb-4': selectedFilter === 'accounts' })}
        >
          {searchResults}
        </ScrollableList>
      )}
    </>
  );
};

export default SearchResults;

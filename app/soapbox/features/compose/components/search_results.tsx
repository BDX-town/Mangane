import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { expandSearch, setFilter } from 'soapbox/actions/search';
import { fetchTrendingStatuses } from 'soapbox/actions/trending_statuses';
import Hashtag from 'soapbox/components/hashtag';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Tabs } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import StatusContainer from 'soapbox/containers/status_container';
import PlaceholderAccount from 'soapbox/features/placeholder/components/placeholder_account';
import PlaceholderHashtag from 'soapbox/features/placeholder/components/placeholder_hashtag';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import type { OrderedSet as ImmutableOrderedSet } from 'immutable';
import type { VirtuosoHandle } from 'react-virtuoso';
import type { SearchFilter } from 'soapbox/reducers/search';

const messages = defineMessages({
  accounts: { id: 'search_results.accounts', defaultMessage: 'People' },
  statuses: { id: 'search_results.statuses', defaultMessage: 'Posts' },
  hashtags: { id: 'search_results.hashtags', defaultMessage: 'Hashtags' },
});

const SearchResults = () => {
  const node = useRef<VirtuosoHandle>(null);

  const intl = useIntl();
  const dispatch = useAppDispatch();

  const value = useAppSelector((state) => state.search.submittedValue);
  const results = useAppSelector((state) => state.search.results);
  const suggestions = useAppSelector((state) => state.suggestions.items);
  const trendingStatuses = useAppSelector((state) => state.trending_statuses.items);
  const trends = useAppSelector((state) => state.trends.items);
  const submitted = useAppSelector((state) => state.search.submitted);
  const selectedFilter = useAppSelector((state) => state.search.filter);

  const handleLoadMore = () => dispatch(expandSearch(selectedFilter));

  const selectFilter = (newActiveFilter: SearchFilter) => dispatch(setFilter(newActiveFilter));

  const renderFilterBar = () => {
    const items = [
      {
        text: intl.formatMessage(messages.accounts),
        action: () => selectFilter('accounts'),
        name: 'accounts',
      },
      {
        text: intl.formatMessage(messages.statuses),
        action: () => selectFilter('statuses'),
        name: 'statuses',
      },
      {
        text: intl.formatMessage(messages.hashtags),
        action: () => selectFilter('hashtags'),
        name: 'hashtags',
      },
    ];

    return <Tabs items={items} activeItem={selectedFilter} />;
  };

  const getCurrentIndex = (id: string): number => {
    return resultsIds?.keySeq().findIndex(key => key === id);
  };

  const handleMoveUp = (id: string) => {
    if (!resultsIds) return;

    const elementIndex = getCurrentIndex(id) - 1;
    selectChild(elementIndex);
  };

  const handleMoveDown = (id: string) => {
    if (!resultsIds) return;

    const elementIndex = getCurrentIndex(id) + 1;
    selectChild(elementIndex);
  };

  const selectChild = (index: number) => {
    node.current?.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const element = document.querySelector<HTMLDivElement>(`#search-results [data-index="${index}"] .focusable`);
        element?.focus();
      },
    });
  };

  useEffect(() => {
    dispatch(fetchTrendingStatuses());
  }, []);

  let searchResults;
  let hasMore = false;
  let loaded;
  let noResultsMessage;
  let placeholderComponent = PlaceholderStatus as React.ComponentType;
  let resultsIds: ImmutableOrderedSet<string>;

  if (selectedFilter === 'accounts') {
    hasMore = results.accountsHasMore;
    loaded = results.accountsLoaded;
    placeholderComponent = PlaceholderAccount;

    if (results.accounts && results.accounts.size > 0) {
      searchResults = results.accounts.map(accountId => <AccountContainer key={accountId} id={accountId} />);
    } else if (!submitted && suggestions && !suggestions.isEmpty()) {
      searchResults = suggestions.map(suggestion => <AccountContainer key={suggestion.account} id={suggestion.account} />);
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
    hasMore = results.statusesHasMore;
    loaded = results.statusesLoaded;

    if (results.statuses && results.statuses.size > 0) {
      searchResults = results.statuses.map((statusId: string) => (
        // @ts-ignore
        <StatusContainer
          key={statusId}
          id={statusId}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      ));
      resultsIds = results.statuses;
    } else if (!submitted && trendingStatuses && !trendingStatuses.isEmpty()) {
      searchResults = trendingStatuses.map((statusId: string) => (
        // @ts-ignore
        <StatusContainer
          key={statusId}
          id={statusId}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      ));
      resultsIds = trendingStatuses;
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
    hasMore = results.hashtagsHasMore;
    loaded = results.hashtagsLoaded;
    placeholderComponent = PlaceholderHashtag;

    if (results.hashtags && results.hashtags.size > 0) {
      searchResults = results.hashtags.map(hashtag => <Hashtag key={hashtag.name} hashtag={hashtag} />);
    } else if (!submitted && suggestions && !suggestions.isEmpty()) {
      searchResults = trends.map(hashtag => <Hashtag key={hashtag.name} hashtag={hashtag} />);
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
          id='search-results'
          ref={node}
          key={selectedFilter}
          scrollKey={`${selectedFilter}:${value}`}
          isLoading={submitted && !loaded}
          showLoading={submitted && !loaded && searchResults?.isEmpty()}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          placeholderComponent={placeholderComponent}
          placeholderCount={20}
          className={classNames({
            'divide-gray-200 dark:divide-gray-800 divide-solid divide-y': selectedFilter === 'statuses',
          })}
          itemClassName={classNames({
            'pb-4': selectedFilter === 'accounts',
            'pb-3': selectedFilter === 'hashtags',
          })}
        >
          {searchResults || []}
        </ScrollableList>
      )}
    </>
  );
};

export default SearchResults;

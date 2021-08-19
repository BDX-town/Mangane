import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AccountContainer from '../../../containers/account_container';
import StatusContainer from '../../../containers/status_container';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Hashtag from '../../../components/hashtag';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import FilterBar from '../../search/components/filter_bar';
import LoadMore from '../../../components/load_more';
import classNames from 'classnames';

export default class SearchResults extends ImmutablePureComponent {

  static propTypes = {
    value: ImmutablePropTypes.string,
    results: ImmutablePropTypes.map.isRequired,
    submitted: PropTypes.bool,
    expandSearch: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    selectFilter: PropTypes.func.isRequired,
  };

  handleLoadMore = () => this.props.expandSearch(this.props.selectedFilter);

  handleSelectFilter = newActiveFilter => this.props.selectFilter(newActiveFilter);

  render() {
    const { value, results, submitted, selectedFilter } = this.props;

    if (submitted && results.isEmpty()) {
      return (
        <div className='search-results'>
          <LoadingIndicator />
        </div>
      );
    }

    let searchResults;
    let hasMore = false;

    if (selectedFilter === 'accounts' && results.get('accounts')) {
      hasMore = results.get('accountsHasMore');

      searchResults = results.get('accounts').size > 0 ? (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('accounts').map(accountId => <AccountContainer key={accountId} id={accountId} />)}
        </div>
      ) : (
        <div className='empty-column-indicator'>
          <FormattedMessage
            id='empty_column.search.accounts'
            defaultMessage='There are no people results for "{term}"'
            values={{ term: value }}
          />
        </div>
      );
    }

    if (selectedFilter === 'statuses' && results.get('statuses')) {
      hasMore = results.get('statusesHasMore');

      searchResults = results.get('statuses').size > 0 ? (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('statuses').map(statusId => <StatusContainer key={statusId} id={statusId} />)}
        </div>
      ) : (
        <div className='empty-column-indicator'>
          <FormattedMessage
            id='empty_column.search.statuses'
            defaultMessage='There are no posts results for "{term}"'
            values={{ term: value }}
          />
        </div>
      );
    }

    if (selectedFilter === 'hashtags' && results.get('hashtags')) {
      hasMore = results.get('hashtagsHasMore');

      searchResults = results.get('hashtags').size > 0 ? (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('hashtags').map(hashtag => <Hashtag key={hashtag.get('name')} hashtag={hashtag} />)}
        </div>
      ) : (
        <div className='empty-column-indicator'>
          <FormattedMessage
            id='empty_column.search.hashtags'
            defaultMessage='There are no hashtags results for "{term}"'
            values={{ term: value }}
          />
        </div>
      );
    }

    return (
      <>
        {submitted && <FilterBar selectedFilter={submitted ? selectedFilter : null} selectFilter={this.handleSelectFilter} />}

        {searchResults}

        {hasMore && <LoadMore visible onClick={this.handleLoadMore} />}
      </>
    );
  }

}

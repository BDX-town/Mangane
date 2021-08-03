import React from 'react';
import PropTypes from 'prop-types';
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
    results: ImmutablePropTypes.map.isRequired,
    submitted: PropTypes.bool,
    expandSearch: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
  };

  handleLoadMore = () => this.props.expandSearch(this.state.selectedFilter);

  handleSelectFilter = newActiveFilter => this.props.selectFilter(newActiveFilter);

  render() {
    const { results, submitted, selectedFilter } = this.props;

    if (submitted && results.isEmpty()) {
      return (
        <div className='search-results'>
          <LoadingIndicator />
        </div>
      );
    }

    let searchResults;
    let hasMore = false;

    if (selectedFilter === 'accounts' && results.get('accounts') && results.get('accounts').size > 0) {
      hasMore = results.get('accountsHasMore');

      searchResults = (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('accounts').map(accountId => <AccountContainer key={accountId} id={accountId} />)}
        </div>
      );
    }

    if (selectedFilter === 'statuses' && results.get('statuses') && results.get('statuses').size > 0) {
      hasMore = results.get('statusesHasMore');

      searchResults = (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('statuses').map(statusId => <StatusContainer key={statusId} id={statusId} />)}
        </div>
      );
    }

    if (selectedFilter === 'hashtags' && results.get('hashtags') && results.get('hashtags').size > 0) {
      hasMore = results.get('hashtagsHasMore');

      searchResults = (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('hashtags').map(hashtag => <Hashtag key={hashtag.get('name')} hashtag={hashtag} />)}
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

import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl } from 'react-intl';
import AccountContainer from '../../../containers/account_container';
import StatusContainer from '../../../containers/status_container';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Hashtag from '../../../components/hashtag';
import Icon from 'soapbox/components/icon';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import FilterBar from '../../search/components/filter_bar';
import LoadMore from '../../../components/load_more';
import classNames from 'classnames';

export default @injectIntl
class SearchResults extends ImmutablePureComponent {

  static propTypes = {
    results: ImmutablePropTypes.map.isRequired,
    submitted: PropTypes.bool,
    expandSearch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    selectedFilter: 'accounts',
  };

  handleLoadMore = () => this.props.expandSearch(this.state.selectedFilter);

  handleSelectFilter = newActiveFilter => {
    console.log(newActiveFilter);
    this.setState({ selectedFilter: newActiveFilter });
  };

  render() {
    const { results, submitted } = this.props;
    const { selectedFilter } = this.state;

    if (submitted && results.isEmpty()) {
      return (
        <div className='search-results'>
          <LoadingIndicator />
        </div>
      );
    }

    let searchResults;
    let count = 0;
    let hasMore = false;

    if (selectedFilter === 'accounts' && results.get('accounts') && results.get('accounts').size > 0) {
      count = results.get('accounts').size;
      hasMore = results.get('accountsHasMore');

      searchResults = (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('accounts').map(accountId => <AccountContainer key={accountId} id={accountId} />)}
        </div>
      );
    }

    if (selectedFilter === 'statuses' && results.get('statuses') && results.get('statuses').size > 0) {
      count = results.get('statuses').size;
      hasMore = results.get('statusesHasMore');

      searchResults = (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('statuses').map(statusId => <StatusContainer key={statusId} id={statusId} />)}
        </div>
      );
    }

    if (selectedFilter === 'hashtags' && results.get('hashtags') && results.get('hashtags').size > 0) {
      count = results.get('hashtags').size;
      hasMore = results.get('hashtagsHasMore');

      searchResults = (
        <div className={classNames('search-results__section', { 'has-more': hasMore })}>
          {results.get('hashtags').map(hashtag => <Hashtag key={hashtag.get('name')} hashtag={hashtag} />)}
        </div>
      );
    }

    return (
      <div className='search-results'>
        <div className='search-results__header'>
          <Icon id='search' fixedWidth />
          {
            hasMore
              ? <FormattedMessage id='search_results.total.has_more' defaultMessage='Over {count, number} {count, plural, one {result} other {results}}' values={{ count }} />
              : <FormattedMessage id='search_results.total' defaultMessage='{count, number} {count, plural, one {result} other {results}}' values={{ count }} />
          }
        </div>

        <FilterBar selectedFilter={selectedFilter} selectFilter={this.handleSelectFilter} />

        {searchResults}

        {hasMore && <LoadMore visible onClick={this.handleLoadMore} />}
      </div>
    );
  }

}

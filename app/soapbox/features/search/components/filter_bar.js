import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

export default @injectIntl
class FilterBar extends React.PureComponent {

  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
  };

  onClick(searchType) {
    return () => this.props.selectFilter(searchType);
  }

  render() {
    const { selectedFilter } = this.props;

    return (
      <div className='search__filter-bar'>
        <button
          className={selectedFilter === 'accounts' ? 'active' : ''}
          onClick={this.onClick('accounts')}
        >
          <FormattedMessage
            id='search_results.accounts'
            defaultMessage='People'
          />
        </button>
        <button
          className={selectedFilter === 'statuses' ? 'active' : ''}
          onClick={this.onClick('statuses')}
        >
          <FormattedMessage
            id='search_results.statuses'
            defaultMessage='Posts'
          />
        </button>
        <button
          className={selectedFilter === 'hashtags' ? 'active' : ''}
          onClick={this.onClick('hashtags')}
        >
          <FormattedMessage
            id='search_results.hashtags'
            defaultMessage='Hashtags'
          />
        </button>
      </div>
    );
  }

}

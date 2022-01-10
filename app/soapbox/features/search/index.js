import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import Column from 'soapbox/components/column';
import ColumnHeader from 'soapbox/components/column_header';
import SearchContainer from 'soapbox/features/compose/containers/search_container';
import SearchResultsContainer from 'soapbox/features/compose/containers/search_results_container';

const messages = defineMessages({
  heading: { id: 'column.search', defaultMessage: 'Search' },
});

const Search = ({ intl }) => (
  <Column className='search-page'>
    <ColumnHeader icon='search' title={intl.formatMessage(messages.heading)} />
    <SearchContainer autoFocus autoSubmit />
    <SearchResultsContainer />
  </Column>
);

Search.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Search);

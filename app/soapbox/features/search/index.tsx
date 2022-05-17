import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Column } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import SearchResultsContainer from 'soapbox/features/compose/containers/search_results_container';

const messages = defineMessages({
  heading: { id: 'column.search', defaultMessage: 'Search' },
});

const SearchPage = () => {
  const intl = useIntl();

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <div className='space-y-4'>
        <Search autoFocus autoSubmit />
        <SearchResultsContainer />
      </div>
    </Column>
  );
};

export default SearchPage;

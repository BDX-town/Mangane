import React from 'react';
import { useHistory } from 'react-router-dom';

import { Card } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import SearchResults from 'soapbox/features/compose/components/search_results';


const SearchPage = () => {
  const history = useHistory();
  // Don't steal focus when returning (back/forward) from a status
  const autoFocus = history.action !== 'POP';

  return (
    <Card variant='rounded' className='grow mb-4 overflow-visible'>
      <Search autoFocus={autoFocus} autoSubmit />
      <SearchResults />
    </Card>
  );
};

export default SearchPage;

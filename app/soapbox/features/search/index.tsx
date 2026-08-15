import React from 'react';

import { Card } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import SearchResults from 'soapbox/features/compose/components/search_results';


const SearchPage = () => {

  return (
    <Card variant='rounded' className='grow mb-4 overflow-visible'>
      <Search autoFocus autoSubmit />
      <SearchResults />
    </Card>
  );
};

export default SearchPage;

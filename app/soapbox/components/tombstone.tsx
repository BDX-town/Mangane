import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Text } from 'soapbox/components/ui';

/** Represents a deleted item. */
const Tombstone: React.FC = () => {
  return (
    <div className='p-9 flex items-center justify-center sm:rounded-xl bg-gray-100 border border-solid border-gray-200 dark:bg-slate-900 dark:border-slate-700'>
      <Text>
        <FormattedMessage id='statuses.tombstone' defaultMessage='One or more posts is unavailable.' />
      </Text>
    </div>
  );
};

export default Tombstone;

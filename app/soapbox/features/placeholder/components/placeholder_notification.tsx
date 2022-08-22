import * as React from 'react';

import PlaceholderAvatar from './placeholder_avatar';
import PlaceholderDisplayName from './placeholder_display_name';
import PlaceholderStatusContent from './placeholder_status_content';

/** Fake notification to display while data is loading. */
const PlaceholderNotification = () => (
  <div className='bg-white dark:bg-slate-800 px-4 py-6 sm:p-6'>
    <div className='w-full animate-pulse'>
      <div className='mb-2'>
        <PlaceholderStatusContent minLength={20} maxLength={20} />
      </div>

      <div>
        <div className='flex space-x-3 items-center'>
          <div className='flex-shrink-0'>
            <PlaceholderAvatar size={48} />
          </div>

          <div className='min-w-0 flex-1'>
            <PlaceholderDisplayName minLength={3} maxLength={25} />
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <PlaceholderStatusContent minLength={5} maxLength={120} />
      </div>
    </div>
  </div>
);

export default React.memo(PlaceholderNotification);

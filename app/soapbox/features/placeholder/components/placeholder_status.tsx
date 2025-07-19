import classNames from 'classnames';
import * as React from 'react';

import PlaceholderAvatar from './placeholder_avatar';
import PlaceholderDisplayName from './placeholder_display_name';
import PlaceholderStatusContent from './placeholder_status_content';

interface IPlaceholderStatus {
  thread?: boolean
}

/** Fake status to display while data is loading. */
const PlaceholderStatus: React.FC<IPlaceholderStatus> = ({ thread = false }) => (
  <div
    className={classNames({
      'status-placeholder bg-white dark:bg-slate-800': true,
      'shadow-xl dark:shadow-inset sm:rounded-xl px-4 py-6 sm:p-5 from-primary-500/10 dark:from-primary-200/10 to-white dark:via-slate-800 dark:to-slate-800': !thread,
    })}
    style={
      {
        background: 'linear-gradient(to bottom, var(--tw-gradient-from) 0px, var(--tw-gradient-to) 50px, var(--tw-gradient-to) 100%)',
      }
    }
  >
    <div className='w-full animate-pulse overflow-hidden'>
      <div>
        <div className='flex space-x-3 items-center'>
          <div className='flex-shrink-0'>
            <PlaceholderAvatar size={42} />
          </div>

          <div className='min-w-0 flex-1'>
            <PlaceholderDisplayName minLength={3} maxLength={25} />
          </div>
        </div>
      </div>

      <div className='mt-4 status__content-wrapper'>
        <PlaceholderStatusContent minLength={5} maxLength={120} />
      </div>
    </div>
  </div>
);

export default React.memo(PlaceholderStatus);

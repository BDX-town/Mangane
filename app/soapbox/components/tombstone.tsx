import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { FormattedMessage } from 'react-intl';

import { Text } from 'soapbox/components/ui';

interface ITombstone {
  id: string,
  onMoveUp: (statusId: string) => void,
  onMoveDown: (statusId: string) => void,
}

/** Represents a deleted item. */
const Tombstone: React.FC<ITombstone> = ({ id, onMoveUp, onMoveDown }) => {
  const handlers = {
    moveUp: () => onMoveUp(id),
    moveDown: () => onMoveDown(id),
  };

  return (
    <HotKeys handlers={handlers}>
      <div className='p-9 flex items-center justify-center sm:rounded-xl bg-gray-100 border border-solid border-gray-200 dark:bg-gray-900 dark:border-gray-800 focusable' tabIndex={0}>
        <Text>
          <FormattedMessage id='statuses.tombstone' defaultMessage='One or more posts are unavailable.' />
        </Text>
      </div>
    </HotKeys>
  );
};

export default Tombstone;

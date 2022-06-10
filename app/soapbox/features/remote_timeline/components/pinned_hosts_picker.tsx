'use strict';

import React from 'react';

import { Button, HStack } from 'soapbox/components/ui';
import { useSettings } from 'soapbox/hooks';

interface IPinnedHostsPicker {
  /** The active host among pinned hosts. */
  host?: string,
}

const PinnedHostsPicker: React.FC<IPinnedHostsPicker> = ({ host: activeHost }) => {
  const settings = useSettings();
  const pinnedHosts = settings.getIn(['remote_timeline', 'pinnedHosts']) as any;

  if (!pinnedHosts || pinnedHosts.isEmpty()) return null;

  return (
    <HStack className='mb-4' space={2}>
      {pinnedHosts.map((host: any) => (
        <Button
          key={host}
          to={`/timeline/${host}`}
          size='sm'
          theme={host === activeHost ? 'accent' : 'secondary'}
        >
          {host}
        </Button>
      ))}
    </HStack>
  );
};

export default PinnedHostsPicker;

import { IconPin, IconPinnedOff, IconPinned } from '@tabler/icons';
import React, { SVGAttributes, useCallback, useMemo, useState } from 'react';

import { getPinnedHosts, pinHost, unpinHost } from 'soapbox/actions/remote_timeline';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetRemoteInstance } from 'soapbox/selectors';


export const ButtonPin = ({ instance, ...props }: { instance: string } & SVGAttributes<SVGElement>) => {
  const [hover, setHover] = useState(false);

  const pinnedHosts = useAppSelector(s => getPinnedHosts(s));
  const dispatch = useAppDispatch();
  const pinned = pinnedHosts.find((hs) => hs.get('host') === instance);

  const getRemoteInstance = makeGetRemoteInstance();
  const favicon = useAppSelector((s) => getRemoteInstance(s, instance)).get('favicon') as string;

  const onClick = useCallback(() => {
    if (pinned) {
      dispatch(unpinHost(instance));
    } else {
      dispatch(pinHost(instance, favicon));
    }
  }, [dispatch, pinned, instance, favicon]);

  const finalProps = useMemo(() => ({
    ...props,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick,
  }), [props, onClick]);

  if (hover) {
    return pinned ? <IconPinnedOff className='cursor-pointer' {...finalProps} /> : <IconPinned className='cursor-pointer' {...finalProps} />;
  }

  return pinned ? <IconPinned {...finalProps} className='text-accent-300' /> : <IconPin {...finalProps} />;
};
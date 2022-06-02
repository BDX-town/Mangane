import classNames from 'classnames';
import { throttle } from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useIntl, MessageDescriptor } from 'react-intl';

import Icon from 'soapbox/components/icon';
import { Text } from 'soapbox/components/ui';
import { useAppSelector, useSettings } from 'soapbox/hooks';

interface ITimelineQueueButtonHeader {
  onClick: () => void,
  timelineId: string,
  message: MessageDescriptor,
  threshold?: number,
  autoloadThreshold?: number,
}

const TimelineQueueButtonHeader: React.FC<ITimelineQueueButtonHeader> = ({
  onClick,
  timelineId,
  message,
  threshold = 400,
  autoloadThreshold = 50,
}) => {
  const intl = useIntl();
  const settings = useSettings();
  const count = useAppSelector(state => state.timelines.getIn([timelineId, 'totalQueuedItemsCount']));

  const [scrolled, setScrolled] = useState<boolean>(false);
  const autoload = settings.get('autoloadTimelines') === true;

  const handleScroll = useCallback(throttle(() => {
    const { scrollTop } = (document.scrollingElement || document.documentElement);

    if (autoload && scrollTop <= autoloadThreshold) {
      onClick();
    }

    if (scrollTop > threshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, 150, { trailing: true }), []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClick: React.MouseEventHandler = () => {
    setTimeout(scrollUp, 10);
    onClick();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const visible = count > 0 && scrolled;

  const classes = classNames('left-1/2 -translate-x-1/2 fixed top-20 z-50', {
    'hidden': !visible,
  });

  return (
    <div className={classes}>
      <a className='flex items-center bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-100 transition-transform text-white rounded-full px-4 py-2 space-x-1.5 cursor-pointer whitespace-nowrap' onClick={handleClick}>
        <Icon src={require('@tabler/icons/icons/arrow-bar-to-up.svg')} />

        {(count > 0) && (
          <Text theme='inherit' size='sm'>
            {intl.formatMessage(message, { count })}
          </Text>
        )}
      </a>
    </div>
  );
};

export default TimelineQueueButtonHeader;

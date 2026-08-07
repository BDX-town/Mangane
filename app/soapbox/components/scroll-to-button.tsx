import React, { useEffect, useRef, RefObject } from 'react';
import { useIntl, MessageDescriptor } from 'react-intl';

import Icon from 'soapbox/components/icon';
import { Text } from 'soapbox/components/ui';
import { useSettings } from 'soapbox/hooks';

interface IScrollToButton {
  /** Callback when clicked, and also when scrolled to the top. */
  onClick: () => void,
  /** Number of unread items. */
  count: number,
  /** Message to display in the button (should contain a `{count}` value). */
  message: MessageDescriptor,
  /** Distance from the top of the screen (scrolling up) before the action is triggered. */
  autoloadThreshold?: number,
  to: RefObject<HTMLDivElement>
}




/** Floating new post counter above timelines, clicked to scroll to top. */
const ScrollToButton: React.FC<IScrollToButton> = ({
  onClick,
  count,
  message,
  to,
  autoloadThreshold = 50,
}) => {
  const intl = useIntl();
  const settings = useSettings();

  const timer = React.useRef(null);
  const autoload = settings.get('autoloadTimelines') === true;

  const getScrollTop = React.useCallback((): number => {
    return (document.scrollingElement || document.documentElement).scrollTop;
  }, []);

  const maybeUnload = React.useCallback(() => {
    // we need to add a timer since there is a delay between content render and
    // scroll top calculation. Without it, new content is always loaded because
    // scrollTop is 0 at first.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (count > 0 && autoload && getScrollTop() <= autoloadThreshold) {
        onClick();
      }
      timer.current = null;
    }, 1000);
  }, [count, autoload, getScrollTop, autoloadThreshold, onClick]);


  const handleClick: React.MouseEventHandler = () => {
    onClick();
    to.current.scrollIntoView({ block: 'start' });
  };

  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    maybeUnload();
  }, [maybeUnload]);

  const visible = React.useMemo(() => count > 0, [count]) ;

  if (!visible) return null;

  return (
    <div ref={root} className='left-1/2 -translate-x-1/2 fixed top-2 z-50'>
      <button
        className='flex items-center bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-100 transition-transform text-white rounded-full px-4 py-2 space-x-1.5 cursor-pointer whitespace-nowrap'
        onClick={handleClick}
      >
        <Icon src={require('@tabler/icons/arrow-bar-to-up.svg')} fixedWidth={8} />
        <Text theme='inherit' size='xs'>
          {intl.formatMessage(message, { count })}
        </Text>
      </button>
    </div>
  );
};

export default ScrollToButton;

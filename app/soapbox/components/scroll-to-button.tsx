import React, { useRef } from 'react';
import { useIntl, MessageDescriptor } from 'react-intl';

import Icon from 'soapbox/components/icon';
import { Text } from 'soapbox/components/ui';

interface IScrollToButton {
  /** Callback when clicked, and also when scrolled to the top. */
  onClick: () => void,
  /** Number of unread items. */
  count: number,
  /** Message to display in the button (should contain a `{count}` value). */
  message: MessageDescriptor,
}




/** Floating new post counter above timelines, clicked to scroll to top. */
const ScrollToButton: React.FC<IScrollToButton> = ({
  onClick,
  count,
  message,
}) => {
  const intl = useIntl();

  const root = useRef<HTMLDivElement>(null);

  const visible = React.useMemo(() => count > 0, [count]) ;

  if (!visible) return null;

  return (
    <div ref={root} className='left-1/2 -translate-x-1/2 fixed top-2 z-50'>
      <button
        className='flex items-center bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-100 transition-transform text-white rounded-full px-4 py-2 space-x-1.5 cursor-pointer whitespace-nowrap'
        onClick={onClick}
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

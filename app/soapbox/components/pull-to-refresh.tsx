import React from 'react';
import PTRComponent from 'react-simple-pull-to-refresh';

import { Spinner } from 'soapbox/components/ui';

interface IPullToRefresh {
  children: JSX.Element & React.ReactNode,
  onRefresh?: () => Promise<any>
}

/**
 * PullToRefresh:
 * Wrapper around a third-party PTR component with Soapbox defaults.
 */
const PullToRefresh = ({ children, onRefresh, ...rest }: IPullToRefresh) => {
  const handleRefresh = () => {
    if (onRefresh) {
      return onRefresh();
    } else {
      // If not provided, do nothing
      return Promise.resolve();
    }
  };

  return (
    <PTRComponent
      onRefresh={handleRefresh}
      pullingContent={<></>}
      // `undefined` will fallback to the default, while `<></>` will render nothing
      refreshingContent={onRefresh ? <Spinner size={30} withText={false} /> : <></>}
      pullDownThreshold={67}
      maxPullDownDistance={95}
      resistance={2}
      {...rest}
    >
      {children}
    </PTRComponent>
  );
};

export default PullToRefresh;

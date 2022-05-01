import React from 'react';
import PTRComponent from 'react-simple-pull-to-refresh';

import { Spinner } from 'soapbox/components/ui';

interface IPullToRefresh {
  onRefresh?: () => Promise<any>
}

/**
 * PullToRefresh:
 * Wrapper around a third-party PTR component with Soapbox defaults.
 */
const PullToRefresh: React.FC<IPullToRefresh> = ({ children, onRefresh, ...rest }): JSX.Element => {
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
      {/* This thing really wants a single JSX element as its child (TypeScript), so wrap it in one */}
      <>{children}</>
    </PTRComponent>
  );
};

export default PullToRefresh;

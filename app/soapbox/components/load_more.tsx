import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'soapbox/components/ui';

interface ILoadMore {
  onClick: React.MouseEventHandler,
  disabled?: boolean,
  visible?: Boolean,
  className?: string,
}

const LoadMore: React.FC<ILoadMore> = ({ className, onClick, disabled, visible = true }) => {
  if (!visible) {
    return null;
  }

  return (
    <Button classNames={className} theme='primary' block disabled={disabled || !visible} onClick={onClick}>
      <FormattedMessage id='status.load_more' defaultMessage='Load more' />
    </Button>
  );
};

export default LoadMore;

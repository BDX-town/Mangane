import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'soapbox/components/ui';

interface ILoadMore {
  onClick: () => void,
  disabled?: boolean,
  visible?: Boolean,
}

const LoadMore: React.FC<ILoadMore> = ({ onClick, disabled, visible = true }) => {
  if (!visible) {
    return null;
  }

  return (
    <Button theme='primary' block disabled={disabled || !visible} onClick={onClick}>
      <FormattedMessage id='status.load_more' defaultMessage='Load more' />
    </Button>
  );
};

export default LoadMore;

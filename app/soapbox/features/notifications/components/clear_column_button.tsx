import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'soapbox/components/ui';

interface IClearColumnButton {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const ClearColumnButton: React.FC<IClearColumnButton> = ({ onClick }) => (
  <Button theme={"ghost"} onClick={onClick}>
    <FormattedMessage id='notifications.clear' defaultMessage='Clear notifications' />
  </Button>
);

export default ClearColumnButton;

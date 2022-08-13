import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from 'soapbox/components/icon';

interface IClearColumnButton {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const ClearColumnButton: React.FC<IClearColumnButton> = ({ onClick }) => (
  <button className='text-btn column-header__setting-btn' tabIndex={0} onClick={onClick}>
    <Icon src={require('@tabler/icons/eraser.svg')} />
    {' '}
    <FormattedMessage id='notifications.clear' defaultMessage='Clear notifications' />
  </button>
);

export default ClearColumnButton;

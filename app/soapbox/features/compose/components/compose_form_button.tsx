import classNames from 'classnames';
import React from 'react';

import { IconButton } from 'soapbox/components/ui';

interface IComposeFormButton {
  icon: string,
  title?: string,
  active?: boolean,
  disabled?: boolean,
  onClick: () => void,
}

const ComposeFormButton: React.FC<IComposeFormButton> = ({
  icon,
  title,
  active,
  disabled,
  onClick,
}) => {
  return (
    <div>
      <IconButton
        className={classNames('text-gray-400 hover:text-gray-600', { 'text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300': active })}
        src={icon}
        title={title}
        disabled={disabled}
        onClick={onClick}
      />
    </div>
  );
};

export default ComposeFormButton;

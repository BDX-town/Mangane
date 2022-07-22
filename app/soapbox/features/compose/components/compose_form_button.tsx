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
        className={
          classNames({
            'text-gray-600 hover:text-gray-700 dark:hover:text-gray-500': !active,
            'text-primary-500 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-400': active,
          })
        }
        src={icon}
        title={title}
        disabled={disabled}
        onClick={onClick}
      />
    </div>
  );
};

export default ComposeFormButton;

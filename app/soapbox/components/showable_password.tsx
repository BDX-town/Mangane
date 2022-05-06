import classNames from 'classnames';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import IconButton from 'soapbox/components/icon_button';
import { InputContainer, LabelInputContainer } from 'soapbox/features/forms';

const messages = defineMessages({
  showPassword: { id: 'forms.show_password', defaultMessage: 'Show password' },
  hidePassword: { id: 'forms.hide_password', defaultMessage: 'Hide password' },
});

interface IShowablePassword {
  label?: React.ReactNode,
  className?: string,
  hint?: React.ReactNode,
  placeholder?: string,
  error?: boolean,
  onToggleVisibility?: () => void,
  autoComplete?: string,
  autoCorrect?: string,
  autoCapitalize?: string,
  name?: string,
  required?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  onBlur?: React.ChangeEventHandler<HTMLInputElement>,
  value?: string,
}

const ShowablePassword: React.FC<IShowablePassword> = (props) => {
  const intl = useIntl();
  const [revealed, setRevealed] = useState(false);

  const { hint, error, label, className, ...rest } = props;

  const toggleReveal = () => {
    if (props.onToggleVisibility) {
      props.onToggleVisibility();
    } else {
      setRevealed(!revealed);
    }
  };

  const revealButton = (
    <IconButton
      src={revealed ? require('@tabler/icons/icons/eye-off.svg') : require('@tabler/icons/icons/eye.svg')}
      onClick={toggleReveal}
      title={intl.formatMessage(revealed ? messages.hidePassword : messages.showPassword)}
    />
  );

  return (
    <InputContainer {...props} extraClass={classNames('showable-password', className)}>
      {label ? (
        <LabelInputContainer label={label}>
          <input {...rest} type={revealed ? 'text' : 'password'} />
          {revealButton}
        </LabelInputContainer>
      ) : (<>
        <input {...rest} type={revealed ? 'text' : 'password'} />
        {revealButton}
      </>)}
    </InputContainer>
  );
};

export default ShowablePassword;

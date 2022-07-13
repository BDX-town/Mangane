import React from 'react';

import { formatPhoneNumber } from 'soapbox/utils/phone';

import Input from '../input/input';

interface IPhoneInput extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'required'> {
  /** Input phone number. */
  value?: string,
  /** Change event handler taking the formatted input. */
  onChange?: (phone: string) => void,
}

/** Internationalized phone input with country code picker. */
const PhoneInput: React.FC<IPhoneInput> = (props) => {
  const { onChange, ...rest } = props;

  /** Pass the formatted phone to the handler. */
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (onChange) {
      onChange(formatPhoneNumber(target.value));
    }
  };

  return (
    <Input
      type='text'
      onChange={handleChange}
      {...rest}
    />
  );
};

export default PhoneInput;

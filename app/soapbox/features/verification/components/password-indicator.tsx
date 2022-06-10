import React, { useEffect, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Stack } from 'soapbox/components/ui';
import ValidationCheckmark from 'soapbox/components/validation-checkmark';

const messages = defineMessages({
  minimumCharacters: {
    id: 'registration.validation.minimum_characters',
    defaultMessage: '8 characters',
  },
  capitalLetter: {
    id: 'registration.validation.capital_letter',
    defaultMessage: '1 capital letter',
  },
  lowercaseLetter: {
    id: 'registration.validation.lowercase_letter',
    defaultMessage: '1 lowercase letter',
  },
});

const hasUppercaseCharacter = (string: string) => {
  for (let i = 0; i < string.length; i++) {
    if (string.charAt(i) === string.charAt(i).toUpperCase() && string.charAt(i).match(/[a-z]/i)) {
      return true;
    }
  }
  return false;
};

const hasLowercaseCharacter = (string: string) => {
  return string.toUpperCase() !== string;
};

interface IPasswordIndicator {
  onChange(isValid: boolean): void
  password: string
}

const PasswordIndicator = ({ onChange, password }: IPasswordIndicator) => {
  const intl = useIntl();

  const meetsLengthRequirements = useMemo(() => password.length >= 8, [password]);
  const meetsCapitalLetterRequirements = useMemo(() => hasUppercaseCharacter(password), [password]);
  const meetsLowercaseLetterRequirements = useMemo(() => hasLowercaseCharacter(password), [password]);
  const hasValidPassword = meetsLengthRequirements && meetsCapitalLetterRequirements && meetsLowercaseLetterRequirements;

  useEffect(() => {
    onChange(hasValidPassword);
  }, [hasValidPassword]);

  return (
    <Stack className='mt-2' space={1}>
      <ValidationCheckmark
        isValid={meetsLengthRequirements}
        text={intl.formatMessage(messages.minimumCharacters)}
      />

      <ValidationCheckmark
        isValid={meetsCapitalLetterRequirements}
        text={intl.formatMessage(messages.capitalLetter)}
      />

      <ValidationCheckmark
        isValid={meetsLowercaseLetterRequirements}
        text={intl.formatMessage(messages.lowercaseLetter)}
      />
    </Stack>
  );
};

export default PasswordIndicator;

import classNames from 'classnames';
import React from 'react';

import { HStack, SemanticIcon, Text } from 'soapbox/components/ui';

interface IValidationCheckmark {
  isValid: boolean
  text: string
}

const ValidationCheckmark = ({ isValid, text }: IValidationCheckmark) => {
  return (
    <HStack alignItems='center' space={2} data-testid='validation-checkmark'>
      <SemanticIcon
        name={isValid ? 'success' : 'pending'}
        size={16}
        weight={isValid ? 'bold' : 'fill'}
        data-testid='validation-state-icon'
        className={classNames({
          'w-4 h-4': true,
          'text-gray-400': !isValid,
          'text-success-500': isValid,
        })}
      />

      <Text theme='muted' size='sm'>{text}</Text>
    </HStack>
  );
};

export default ValidationCheckmark;

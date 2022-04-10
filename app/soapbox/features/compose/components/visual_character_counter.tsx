import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { length } from 'stringz';

import ProgressCircle from 'soapbox/components/progress_circle';

const messages = defineMessages({
  title: { id: 'compose.character_counter.title', defaultMessage: 'Used {chars} out of {maxChars} characters' },
});

interface IVisualCharacterCounter {
  /** max text allowed */
  max: number,
  /** text to use to measure */
  text: string,
}

/** Renders a character counter */
const VisualCharacterCounter: React.FC<IVisualCharacterCounter> = ({ text, max }) => {
  const intl = useIntl();

  const textLength = length(text);
  const progress = textLength / max;

  return (
    <ProgressCircle
      title={intl.formatMessage(messages.title, { chars: textLength, maxChars: max })}
      progress={progress}
      radius={10}
      stroke={3}
    />
  );
};

export default VisualCharacterCounter;

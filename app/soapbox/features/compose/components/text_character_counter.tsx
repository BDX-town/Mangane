import classNames from 'classnames';
import React from 'react';
import { length } from 'stringz';

interface ITextCharacterCounter {
  max: number,
  text: string,
}

const TextCharacterCounter: React.FC<ITextCharacterCounter> = ({ text, max }) => {
  const checkRemainingText = (diff: number) => {
    return (
      <span
        className={classNames('text-sm font-semibold', {
          'text-gray-400': diff >= 0,
          'text-danger-600': diff < 0,
        })}
      >
        {diff}
      </span>
    );
  };

  const diff = max - length(text);
  return checkRemainingText(diff);
};

export default TextCharacterCounter;

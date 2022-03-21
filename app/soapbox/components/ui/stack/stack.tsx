import classNames from 'classnames';
import React from 'react';

type SIZES = 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5

const spaces = {
  '0.5': 'space-y-0.5',
  1: 'space-y-1',
  '1.5': 'space-y-1.5',
  2: 'space-y-2',
  3: 'space-y-3',
  4: 'space-y-4',
  5: 'space-y-5',
};

const justifyContentOptions = {
  center: 'justify-center',
};

const alignItemsOptions = {
  center: 'items-center',
};

interface IStack {
  space?: SIZES,
  alignItems?: 'center',
  justifyContent?: 'center',
  className?: string,
}

const Stack: React.FC<IStack> = (props) => {
  const { space, alignItems, justifyContent, className, ...filteredProps } = props;

  return (
    <div
      {...filteredProps}
      className={classNames('flex flex-col', {
        [spaces[space]]: typeof space !== 'undefined',
        [alignItemsOptions[alignItems]]: typeof alignItems !== 'undefined',
        [justifyContentOptions[justifyContent]]: typeof justifyContent !== 'undefined',
        [className]: typeof className !== 'undefined',
      })}
    />
  );
};

export default Stack;

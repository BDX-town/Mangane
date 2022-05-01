import classNames from 'classnames';
import React from 'react';

type SIZES = 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 10

const spaces = {
  '0.5': 'space-y-0.5',
  1: 'space-y-1',
  '1.5': 'space-y-1.5',
  2: 'space-y-2',
  3: 'space-y-3',
  4: 'space-y-4',
  5: 'space-y-5',
  10: 'space-y-10',
};

const justifyContentOptions = {
  center: 'justify-center',
};

const alignItemsOptions = {
  center: 'items-center',
};

interface IStack extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the gap between elements. */
  space?: SIZES,
  /** Horizontal alignment of children. */
  alignItems?: 'center',
  /** Vertical alignment of children. */
  justifyContent?: 'center',
  /** Extra class names on the <div> element. */
  className?: string,
}

/** Vertical stack of child elements. */
const Stack: React.FC<IStack> = (props) => {
  const { space, alignItems, justifyContent, className, ...filteredProps } = props;

  return (
    <div
      {...filteredProps}
      className={classNames('flex flex-col', {
        // @ts-ignore
        [spaces[space]]: typeof space !== 'undefined',
        // @ts-ignore
        [alignItemsOptions[alignItems]]: typeof alignItems !== 'undefined',
        // @ts-ignore
        [justifyContentOptions[justifyContent]]: typeof justifyContent !== 'undefined',
      }, className)}
    />
  );
};

export default Stack;

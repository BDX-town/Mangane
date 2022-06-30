import classNames from 'classnames';
import React from 'react';

const justifyContentOptions = {
  between: 'justify-between',
  center: 'justify-center',
  start: 'justify-start',
  end: 'justify-end',
};

const alignItemsOptions = {
  top: 'items-start',
  bottom: 'items-end',
  center: 'items-center',
  start: 'items-start',
};

const spaces = {
  '0.5': 'space-x-0.5',
  1: 'space-x-1',
  1.5: 'space-x-1.5',
  2: 'space-x-2',
  3: 'space-x-3',
  4: 'space-x-4',
  6: 'space-x-6',
  8: 'space-x-8',
};

interface IHStack {
  /** Vertical alignment of children. */
  alignItems?: 'top' | 'bottom' | 'center' | 'start',
  /** Extra class names on the <div> element. */
  className?: string,
  /** Horizontal alignment of children. */
  justifyContent?: 'between' | 'center' | 'start' | 'end',
  /** Size of the gap between elements. */
  space?: 0.5 | 1 | 1.5 | 2 | 3 | 4 | 6 | 8,
  /** Whether to let the flexbox grow. */
  grow?: boolean,
  /** Extra CSS styles for the <div> */
  style?: React.CSSProperties
}

/** Horizontal row of child elements. */
const HStack: React.FC<IHStack> = (props) => {
  const { space, alignItems, grow, justifyContent, className, ...filteredProps } = props;

  return (
    <div
      {...filteredProps}
      className={classNames('flex', {
        // @ts-ignore
        [alignItemsOptions[alignItems]]: typeof alignItems !== 'undefined',
        // @ts-ignore
        [justifyContentOptions[justifyContent]]: typeof justifyContent !== 'undefined',
        // @ts-ignore
        [spaces[space]]: typeof space !== 'undefined',
        'flex-grow': grow,
      }, className)}
    />
  );
};

export default HStack;

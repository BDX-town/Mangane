import classNames from 'classnames';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Icon from './icon';

const List: React.FC = ({ children }) => (
  <div className='space-y-0.5'>{children}</div>
);

interface IListItem {
  label: React.ReactNode,
  hint?: React.ReactNode,
  onClick?: () => void,
}

const ListItem: React.FC<IListItem> = ({ label, hint, children, onClick }) => {
  const id = uuidv4();
  const domId = `list-group-${id}`;

  const Comp = onClick ? 'a' : 'div';
  const LabelComp = onClick ? 'span' : 'label';
  const linkProps = onClick ? { onClick } : {};

  const renderChildren = React.useCallback(() =>
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          id: domId,
        });
      }

      return null;
    })
  , [children, domId]);

  return (
    <Comp
      className={classNames({
        'flex items-center justify-between px-3 py-2 first:rounded-t-lg last:rounded-b-lg bg-gradient-to-r from-gradient-start/10 to-gradient-end/10 dark:from-slate-900/25 dark:to-slate-900/50': true,
        'cursor-pointer hover:from-gradient-start/20 hover:to-gradient-end/20 dark:hover:from-slate-900/40 dark:hover:to-slate-900/75': typeof onClick !== 'undefined',
      })}
      {...linkProps}
    >
      <div className='flex flex-col py-1.5 pr-4'>
        <LabelComp className='text-black dark:text-white' htmlFor={domId}>{label}</LabelComp>

        {hint ? (
          <span className='text-sm text-gray-500 dark:text-gray-400'>{hint}</span>
        ) : null}
      </div>

      {onClick ? (
        <div className='flex flex-row items-center text-gray-500 dark:text-gray-400'>
          {children}

          <Icon src={require('@tabler/icons/icons/chevron-right.svg')} className='ml-1' />
        </div>
      ) : renderChildren()}
    </Comp>
  );
};

export { List as default, ListItem };

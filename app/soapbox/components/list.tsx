import classNames from 'classnames';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { SelectDropdown } from '../features/forms';

import Icon from './icon';
import { Select } from './ui';

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

  const renderChildren = React.useCallback(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const isSelect = child.type === SelectDropdown || child.type === Select;

        return React.cloneElement(child, {
          id: domId,
          className: classNames({
            'w-auto': isSelect,
          }),
        });
      }

      return null;
    });
  }, [children, domId]);

  return (
    <Comp
      className={classNames({
        'flex items-center justify-between px-3 py-2 first:rounded-t-lg last:rounded-b-lg bg-gradient-to-r from-gradient-start/10 to-gradient-end/10': true,
        'cursor-pointer hover:from-gradient-start/20 hover:to-gradient-end/20 dark:hover:from-gradient-start/5 dark:hover:to-gradient-end/5': typeof onClick !== 'undefined',
      })}
      {...linkProps}
    >
      <div className='flex flex-col py-1.5 pr-4'>
        <LabelComp className='text-gray-900 dark:text-gray-100' htmlFor={domId}>{label}</LabelComp>

        {hint ? (
          <span className='text-sm text-gray-700 dark:text-gray-600'>{hint}</span>
        ) : null}
      </div>

      {onClick ? (
        <div className='flex flex-row items-center text-gray-700 dark:text-gray-600'>
          {children}

          <Icon src={require('@tabler/icons/chevron-right.svg')} className='ml-1' />
        </div>
      ) : renderChildren()}
    </Comp>
  );
};

export { List as default, ListItem };

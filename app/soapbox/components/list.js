import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Icon from './icon';


const List = ({ children }) => (
  <div className='space-y-0.5'>{children}</div>
);

List.propTypes = {
  children: PropTypes.node,
};

const ListItem = ({ label, hint, children, onClick }) => {
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
        'flex items-center justify-between px-3 py-2 first:rounded-t-lg last:rounded-b-lg bg-gradient-to-r from-gradient-purple/20 to-gradient-blue/20': true,
        'cursor-pointer hover:from-gradient-purple/30 hover:to-gradient-blue/30': typeof onClick !== 'undefined',
      })}
      {...linkProps}
    >
      <div className='flex flex-col py-1.5 pr-4'>
        <LabelComp htmlFor={domId}>{label}</LabelComp>

        {hint ? (
          <span className='text-sm text-gray-500'>{hint}</span>
        ) : null}
      </div>

      {onClick ? (
        <div className='flex flex-row items-center text-gray-500'>
          {children}

          <Icon src={require('@tabler/icons/icons/chevron-right.svg')} className='ml-1' />
        </div>
      ) : renderChildren()}
    </Comp>
  );
};

ListItem.propTypes = {
  label: PropTypes.node.isRequired,
  hint: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export { List as default, ListItem };

import classNames from 'classnames';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import IconWithCounter from 'soapbox/components/icon_with_counter';
import { Icon } from 'soapbox/components/ui';

interface IThumbNavigationLink {
  count?: number,
  src: string,
  text: string | React.ReactElement,
  to?: string,
  exact?: boolean,
  paths?: Array<string>,
  onClick?: React.MouseEventHandler,
  active?: boolean,
  className?: string,
}

const ThumbNavigationLink: React.FC<IThumbNavigationLink> = ({ count, src, text, to, exact, paths, onClick, active, className }): JSX.Element => {
  const { pathname } = useLocation();

  const isActive = (): boolean => {
    if (active) return active;
    if (paths) {
      return paths.some(path =>  pathname.startsWith(path));
    } else {
      return exact ? pathname === to : pathname.startsWith(to);
    }
  };

  const internalActive = isActive();

  const Wrapper = React.useMemo(() => ({ children }) => to ? <NavLink to={to} exact={exact} className={`${className} px-2 py-2.5 space-y-1 flex flex-col flex-1 items-center text-gray-600`}>{ children }</NavLink> : <button className={`${className} px-2 py-2.5 space-y-1 flex flex-col flex-1 items-center text-gray-600`} onClick={onClick}>{ children }</button>, [to, onClick, exact]);

  return (
    <Wrapper>
      {count !== undefined ? (
        <IconWithCounter
          src={src}
          className={classNames({
            'h-5 w-5': true,
            'text-gray-600 dark:text-gray-300': !internalActive,
            'text-primary-600': internalActive,
          })}
          count={count}
        />
      ) : (
        <Icon
          src={src}
          className={classNames({
            'h-5 w-5': true,
            'text-gray-600 dark:text-gray-300': !internalActive,
            'text-primary-600': internalActive,
          })}
        />
      )}

      <span className='text-[0.7rem] text-gray-900 dark:text-gray-100 font-normal tracking-normal font-sans normal-case'>
        {text}
      </span>
    </Wrapper>
  );
};

export default ThumbNavigationLink;

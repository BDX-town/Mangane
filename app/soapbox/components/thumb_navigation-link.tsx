import classNames from 'classnames';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import IconWithCounter from 'soapbox/components/icon_with_counter';
import { Icon, Text } from 'soapbox/components/ui';

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

  const Wrapper = React.useMemo(() => ({ children }) => to ? <NavLink to={to} exact={exact} className={`${className} thumb-navigation__link`}>{ children }</NavLink> : <button className={`${className} thumb-navigation__link`} onClick={onClick}>{ children }</button>, [to, onClick, exact]);

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

      <Text tag='span' size='xs'>
        {text}
      </Text>
    </Wrapper>
  );
};

export default ThumbNavigationLink;

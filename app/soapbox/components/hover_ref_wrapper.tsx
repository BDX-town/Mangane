import classNames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useRef } from 'react';

import { fetchAccount } from 'soapbox/actions/accounts';
import {
  openProfileHoverCard,
  closeProfileHoverCard,
} from 'soapbox/actions/profile_hover_card';
import { useAppDispatch } from 'soapbox/hooks';
import { isMobile } from 'soapbox/is_mobile';

const showProfileHoverCard = debounce((dispatch, ref, accountId) => {
  dispatch(openProfileHoverCard(ref, accountId));
}, 600);

interface IHoverRefWrapper {
  accountId: string,
  inline?: boolean,
  className?: string,
}

/** Makes a profile hover card appear when the wrapped element is hovered. */
export const HoverRefWrapper: React.FC<IHoverRefWrapper> = ({ accountId, children, inline = false, className }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const Elem: keyof JSX.IntrinsicElements = React.useMemo(() => inline ? 'span' : 'div', [inline]);

  const handleMouseEnter = React.useCallback(() => {
    if (!isMobile(window.innerWidth)) {
      dispatch(fetchAccount(accountId));
      showProfileHoverCard(dispatch, ref, accountId);
    }
  }, [dispatch, accountId]);

  const handleMouseLeave = React.useCallback(() => {
    showProfileHoverCard.cancel();
    setTimeout(() => dispatch(closeProfileHoverCard()), 300);
  }, [dispatch]);

  const handleClick = React.useCallback(() => {
    showProfileHoverCard.cancel();
    dispatch(closeProfileHoverCard(true));
  }, [dispatch]);

  return (
    <Elem
      ref={ref}
      className={classNames('hover-ref-wrapper', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </Elem>
  );
};

export { HoverRefWrapper as default, showProfileHoverCard };

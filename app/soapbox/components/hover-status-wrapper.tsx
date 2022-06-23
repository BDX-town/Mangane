import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  openStatusHoverCard,
  closeStatusHoverCard,
} from 'soapbox/actions/status-hover-card';
import { isMobile } from 'soapbox/is_mobile';

const showStatusHoverCard = debounce((dispatch, ref, statusId) => {
  dispatch(openStatusHoverCard(ref, statusId));
}, 300);

interface IHoverStatusWrapper {
  statusId: any,
  inline: boolean,
  className?: string,
}

/** Makes a status hover card appear when the wrapped element is hovered. */
export const HoverStatusWrapper: React.FC<IHoverStatusWrapper> = ({ statusId, children, inline = false, className }) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const Elem: keyof JSX.IntrinsicElements = inline ? 'span' : 'div';

  const handleMouseEnter = () => {
    if (!isMobile(window.innerWidth)) {
      showStatusHoverCard(dispatch, ref, statusId);
    }
  };

  const handleMouseLeave = () => {
    showStatusHoverCard.cancel();
    setTimeout(() => dispatch(closeStatusHoverCard()), 200);
  };

  const handleClick = () => {
    showStatusHoverCard.cancel();
    dispatch(closeStatusHoverCard(true));
  };

  return (
    <Elem
      ref={ref}
      className={classNames('hover-status-wrapper', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </Elem>
  );
};

export { HoverStatusWrapper as default, showStatusHoverCard };

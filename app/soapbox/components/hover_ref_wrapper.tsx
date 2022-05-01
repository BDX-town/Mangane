import { debounce } from 'lodash';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  openProfileHoverCard,
  closeProfileHoverCard,
} from 'soapbox/actions/profile_hover_card';
import { isMobile } from 'soapbox/is_mobile';

const showProfileHoverCard = debounce((dispatch, ref, accountId) => {
  dispatch(openProfileHoverCard(ref, accountId));
}, 600);

interface IHoverRefWrapper {
  accountId: string,
  inline: boolean,
}

/** Makes a profile hover card appear when the wrapped element is hovered. */
export const HoverRefWrapper: React.FC<IHoverRefWrapper> = ({ accountId, children, inline = false }) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const Elem: keyof JSX.IntrinsicElements = inline ? 'span' : 'div';

  const handleMouseEnter = () => {
    if (!isMobile(window.innerWidth)) {
      showProfileHoverCard(dispatch, ref, accountId);
    }
  };

  const handleMouseLeave = () => {
    showProfileHoverCard.cancel();
    setTimeout(() => dispatch(closeProfileHoverCard()), 300);
  };

  const handleClick = () => {
    showProfileHoverCard.cancel();
    dispatch(closeProfileHoverCard(true));
  };

  return (
    <Elem
      ref={ref}
      className='hover-ref-wrapper'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </Elem>
  );
};

export { HoverRefWrapper as default, showProfileHoverCard };

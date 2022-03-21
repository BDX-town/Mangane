import { debounce } from 'lodash';
import PropTypes from 'prop-types';
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

export const HoverRefWrapper = ({ accountId, children, inline }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const Elem = inline ? 'span' : 'div';

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

HoverRefWrapper.propTypes = {
  accountId: PropTypes.string,
  children: PropTypes.node,
  inline: PropTypes.bool,
};

HoverRefWrapper.defaultProps = {
  inline: false,
};

export { HoverRefWrapper as default, showProfileHoverCard };

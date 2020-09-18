import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  openProfileHoverCard,
  closeProfileHoverCard,
} from 'soapbox/actions/profile_hover_card';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { isMobile } from 'soapbox/is_mobile';

const showProfileHoverCard = debounce((dispatch, ref, accountId) => {
  dispatch(openProfileHoverCard(ref, accountId));
}, 1200);

const handleMouseEnter = (dispatch, ref, accountId) => {
  return e => {
    if (!isMobile(window.innerWidth))
      showProfileHoverCard(dispatch, ref, accountId);
  };
};

const handleMouseLeave = (dispatch) => {
  return e => {
    showProfileHoverCard.cancel();
    setTimeout(() => dispatch(closeProfileHoverCard()), 300);
  };
};

const handleClick = (dispatch) => {
  return e => {
    showProfileHoverCard.cancel();
    dispatch(closeProfileHoverCard(true));
  };
};

export const HoverRefWrapper = ({ accountId, children, inline }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const Elem = inline ? 'span' : 'div';

  return (
    <Elem
      ref={ref}
      className='hover-ref-wrapper'
      onMouseEnter={handleMouseEnter(dispatch, ref, accountId)}
      onMouseLeave={handleMouseLeave(dispatch)}
      onClick={handleClick(dispatch)}
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

export default HoverRefWrapper;

// Like react-motion's Motion, but reduces all animations to cross-fades
// for the benefit of users with motion sickness.
import React from 'react';
import { Motion, MotionProps } from 'react-motion';

const stylesToKeep = ['opacity', 'backgroundOpacity'];

const extractValue = (value: any) => {
  // This is either an object with a "val" property or it's a number
  return (typeof value === 'object' && value && 'val' in value) ? value.val : value;
};

const ReducedMotion: React.FC<MotionProps> = ({ style = {}, defaultStyle = {}, children }) => {

  Object.keys(style).forEach(key => {
    if (stylesToKeep.includes(key)) {
      return;
    }
    // If it's setting an x or height or scale or some other value, we need
    // to preserve the end-state value without actually animating it
    style[key] = defaultStyle[key] = extractValue(style[key]);
  });

  return (
    <Motion style={style} defaultStyle={defaultStyle}>
      {children}
    </Motion>
  );
};

export default ReducedMotion;

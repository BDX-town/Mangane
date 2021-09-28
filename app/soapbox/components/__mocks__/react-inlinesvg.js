import React from 'react';
import PropTypes from 'prop-types';

export default function InlineSVG({ src }) {
  return <svg id={src} />;
}

InlineSVG.propTypes = {
  src: PropTypes.node.isRequired,
};

import PropTypes from 'prop-types';
import React from 'react';

export default function InlineSVG({ src }) {
  return <svg id={src} />;
}

InlineSVG.propTypes = {
  src: PropTypes.node.isRequired,
};

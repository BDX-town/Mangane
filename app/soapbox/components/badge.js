import PropTypes from 'prop-types';
import React from 'react';

const Badge = (props) => (
  <span className={'badge badge--' + props.slug}>{props.title}</span>
);

Badge.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Badge;

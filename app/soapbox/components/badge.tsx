import PropTypes from 'prop-types';
import React from 'react';

const Badge = (props: any) => (
  <span data-testid='badge' className={'badge badge--' + props.slug}>{props.title}</span>
);

Badge.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Badge;

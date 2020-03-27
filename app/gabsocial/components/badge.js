import React from 'react';

const Badge = (props) => (
  <span className={'badge badge--' + props.slug}>{props.title}</span>
);

export default Badge;

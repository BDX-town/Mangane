import PropTypes from 'prop-types';
import React from 'react';

import { useAppSelector } from 'soapbox/hooks';

const Badge = (props: any) => {
  const title = useAppSelector(state => state.instance.titles);

  return (
    <span title={title} className={'badge badge--' + props.slug}>{props.title}</span>
  );
};

Badge.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Badge;

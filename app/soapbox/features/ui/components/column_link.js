import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Icon from 'soapbox/components/icon';

const ColumnLink = ({ icon, src, text, to, href, method, badge }) => {
  const badgeElement = typeof badge !== 'undefined' ? <span className='column-link__badge'>{badge}</span> : null;

  if (href) {
    return (
      <a href={href} className='column-link' data-method={method}>
        <Icon id={icon} src={src} fixedWidth className='column-link__icon' />
        {text}
        {badgeElement}
      </a>
    );
  } else {
    return (
      <Link to={to} className='column-link'>
        <Icon id={icon} src={src} fixedWidth className='column-link__icon' />
        {text}
        {badgeElement}
      </Link>
    );
  }
};

ColumnLink.propTypes = {
  icon: PropTypes.string,
  src: PropTypes.string,
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  href: PropTypes.string,
  method: PropTypes.string,
  badge: PropTypes.node,
};

export default ColumnLink;

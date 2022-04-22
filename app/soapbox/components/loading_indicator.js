import React from 'react';
import { FormattedMessage } from 'react-intl';

const LoadingIndicator = () => (
  <div className='loading-indicator'>
    <div className='loading-indicator__container'>
      <div className='loading-indicator__figure' />
    </div>
    <span><FormattedMessage id='loading_indicator.label' defaultMessage='Loading…' /></span>
  </div>
);

export default LoadingIndicator;

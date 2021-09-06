import React from 'react';
import { NODE_ENV } from 'soapbox/build_config';

if (NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

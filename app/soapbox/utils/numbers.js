import React from 'react';
import { FormattedNumber } from 'react-intl';

const isNumber = number => typeof number === 'number' && !isNaN(number);

export const shortNumberFormat = number => {
  if (!isNumber(number)) return '•';

  if (number < 1000) {
    return <FormattedNumber value={number} />;
  } else {
    return <span><FormattedNumber value={number / 1000} maximumFractionDigits={1} />K</span>;
  }
};

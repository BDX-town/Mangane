import React from 'react';

import { render, screen } from '../../jest/test-helpers';
import { isIntegerId, shortNumberFormat } from '../numbers';

test('isIntegerId()', () => {
  expect(isIntegerId('0')).toBe(true);
  expect(isIntegerId('1')).toBe(true);
  expect(isIntegerId('508107650')).toBe(true);
  expect(isIntegerId('-1764036199')).toBe(true);
  expect(isIntegerId('106801667066418367')).toBe(true);
  expect(isIntegerId('9v5bmRalQvjOy0ECcC')).toBe(false);
  expect(isIntegerId(null)).toBe(false);
  expect(isIntegerId(undefined)).toBe(false);
});

describe('shortNumberFormat', () => {
  test('handles non-numbers', () => {
    render(<div data-testid='num'>{shortNumberFormat('not-number')}</div>, null, null);
    expect(screen.getByTestId('num')).toHaveTextContent('•');
  });

  test('formats numbers under 1,000', () => {
    render(<div data-testid='num'>{shortNumberFormat(555)}</div>, null, null);
    expect(screen.getByTestId('num')).toHaveTextContent('555');
  });

  test('formats numbers under 1,000,000', () => {
    render(<div data-testid='num'>{shortNumberFormat(5555)}</div>, null, null);
    expect(screen.getByTestId('num')).toHaveTextContent('5.6K');
  });

  test('formats numbers over 1,000,000', () => {
    render(<div data-testid='num'>{shortNumberFormat(5555555)}</div>, null, null);
    expect(screen.getByTestId('num')).toHaveTextContent('5.6M');
  });
});

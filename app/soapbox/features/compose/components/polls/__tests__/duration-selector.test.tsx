import userEvent from '@testing-library/user-event';
import React from 'react';

import { render, screen } from '../../../../../jest/test-helpers';
import DurationSelector from '../duration-selector';

describe('<DurationSelector />', () => {
  it('defaults to 2 days', () => {
    const handler = jest.fn();
    render(<DurationSelector onDurationChange={handler} />);

    expect(screen.getByTestId('duration-selector-days')).toHaveValue('2');
    expect(screen.getByTestId('duration-selector-hours')).toHaveValue('0');
    expect(screen.getByTestId('duration-selector-minutes')).toHaveValue('0');
  });

  describe('when changing the day', () => {
    it('calls the "onDurationChange" callback', async() => {
      const handler = jest.fn();
      render(<DurationSelector onDurationChange={handler} />);

      await userEvent.selectOptions(
        screen.getByTestId('duration-selector-days'),
        screen.getByRole('option', { name: '1 day' }),
      );

      expect(handler.mock.calls[0][0]).toEqual(172800); // 2 days
      expect(handler.mock.calls[1][0]).toEqual(86400); // 1 day
    });

    it('should disable the hour/minute select if 7 days selected', async() => {
      const handler = jest.fn();
      render(<DurationSelector onDurationChange={handler} />);

      expect(screen.getByTestId('duration-selector-hours')).not.toBeDisabled();
      expect(screen.getByTestId('duration-selector-minutes')).not.toBeDisabled();

      await userEvent.selectOptions(
        screen.getByTestId('duration-selector-days'),
        screen.getByRole('option', { name: '7 days' }),
      );

      expect(screen.getByTestId('duration-selector-hours')).toBeDisabled();
      expect(screen.getByTestId('duration-selector-minutes')).toBeDisabled();
    });
  });

  describe('when changing the hour', () => {
    it('calls the "onDurationChange" callback', async() => {
      const handler = jest.fn();
      render(<DurationSelector onDurationChange={handler} />);

      await userEvent.selectOptions(
        screen.getByTestId('duration-selector-hours'),
        screen.getByRole('option', { name: '1 hour' }),
      );

      expect(handler.mock.calls[0][0]).toEqual(172800); // 2 days
      expect(handler.mock.calls[1][0]).toEqual(176400); // 2 days, 1 hour
    });
  });

  describe('when changing the minute', () => {
    it('calls the "onDurationChange" callback', async() => {
      const handler = jest.fn();
      render(<DurationSelector onDurationChange={handler} />);

      await userEvent.selectOptions(
        screen.getByTestId('duration-selector-minutes'),
        screen.getByRole('option', { name: '15 minutes' }),
      );

      expect(handler.mock.calls[0][0]).toEqual(172800); // 2 days
      expect(handler.mock.calls[1][0]).toEqual(173700); // 2 days, 1 minute
    });
  });
});

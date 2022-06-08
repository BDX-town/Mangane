import userEvent from '@testing-library/user-event';
import React from 'react';

import { queryAllByRole, render, screen } from '../../../../jest/test-helpers';
import Datepicker from '../datepicker';

describe('<Datepicker />', () => {
  it('defaults to the current date', () => {
    const handler = jest.fn();
    render(<Datepicker onChange={handler} />);
    const today = new Date();

    expect(screen.getByTestId('datepicker-month')).toHaveValue(String(today.getMonth()));
    expect(screen.getByTestId('datepicker-day')).toHaveValue(String(today.getDate()));
    expect(screen.getByTestId('datepicker-year')).toHaveValue(String(today.getFullYear()));
  });

  it('changes number of days based on selected month and year', async() => {
    const handler = jest.fn();
    render(<Datepicker onChange={handler} />);

    await userEvent.selectOptions(
      screen.getByTestId('datepicker-month'),
      screen.getByRole('option', { name: 'February' }),
    );

    await userEvent.selectOptions(
      screen.getByTestId('datepicker-year'),
      screen.getByRole('option', { name: '2020' }),
    );

    let daySelect: HTMLElement;
    daySelect = document.querySelector('[data-testid="datepicker-day"]');
    expect(queryAllByRole(daySelect, 'option')).toHaveLength(29);

    await userEvent.selectOptions(
      screen.getByTestId('datepicker-year'),
      screen.getByRole('option', { name: '2021' }),
    );

    daySelect = document.querySelector('[data-testid="datepicker-day"]') as HTMLElement;
    expect(queryAllByRole(daySelect, 'option')).toHaveLength(28);
  });

  it('ranges from the current year to 120 years ago', () => {
    const handler = jest.fn();
    render(<Datepicker onChange={handler} />);
    const today = new Date();

    const yearSelect = document.querySelector('[data-testid="datepicker-year"]') as HTMLElement;
    expect(queryAllByRole(yearSelect, 'option')).toHaveLength(121);
    expect(queryAllByRole(yearSelect, 'option')[0]).toHaveValue(String(today.getFullYear()));
    expect(queryAllByRole(yearSelect, 'option')[120]).toHaveValue(String(today.getFullYear() - 120));
  });

  it('calls the onChange function when the inputs change', async() => {
    const handler = jest.fn();
    render(<Datepicker onChange={handler} />);

    expect(handler.mock.calls.length).toEqual(1);

    await userEvent.selectOptions(
      screen.getByTestId('datepicker-month'),
      screen.getByRole('option', { name: 'February' }),
    );

    expect(handler.mock.calls.length).toEqual(2);

    await userEvent.selectOptions(
      screen.getByTestId('datepicker-year'),
      screen.getByRole('option', { name: '2020' }),
    );

    expect(handler.mock.calls.length).toEqual(3);

    await userEvent.selectOptions(
      screen.getByTestId('datepicker-day'),
      screen.getByRole('option', { name: '5' }),
    );

    expect(handler.mock.calls.length).toEqual(4);
  });
});

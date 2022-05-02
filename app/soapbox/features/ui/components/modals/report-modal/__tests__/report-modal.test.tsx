import userEvent from '@testing-library/user-event';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import React from 'react';

import { __stub } from 'soapbox/api';

import { render, screen } from '../../../../../../jest/test-helpers';
import { normalizeAccount, normalizeStatus } from '../../../../../../normalizers';
import ReportModal from '../report-modal';

describe('<ReportModal />', () => {
  let store;

  beforeEach(() => {
    const rules = require('soapbox/__fixtures__/rules.json');
    const status = require('soapbox/__fixtures__/status-unordered-mentions.json');

    store = {
      accounts: ImmutableMap({
        '1': normalizeAccount({
          id: '1',
          acct: 'username',
          display_name: 'My name',
          avatar: 'test.jpg',
        }),
      }),
      reports: ImmutableMap({
        new: {
          account_id: '1',
          status_ids: ImmutableSet(['1']),
          rule_ids: ImmutableSet(),
        },
      }),
      statuses: ImmutableMap({
        '1': normalizeStatus(status),
      }),
      rules: {
        items: rules,
      },
    };

    __stub(mock => {
      mock.onGet('/api/v1/instance/rules').reply(200, rules);
      mock.onPost('/api/v1/reports').reply(200, {});
    });
  });

  it('successfully renders the first step', () => {
    render(<ReportModal onClose={jest.fn} />, {}, store);
    expect(screen.getByText('Reason for reporting')).toBeInTheDocument();
  });

  it('successfully moves to the second step', async() => {
    const user = userEvent.setup();
    render(<ReportModal onClose={jest.fn} />, {}, store);
    await user.click(screen.getByTestId('rule-1'));
    await user.click(screen.getByText('Next'));
    expect(screen.getByText(/Further actions:/)).toBeInTheDocument();
  });

  it('successfully moves to the third step', async() => {
    const user = userEvent.setup();
    render(<ReportModal onClose={jest.fn} />, {}, store);
    await user.click(screen.getByTestId('rule-1'));
    await user.click(screen.getByText(/Next/));
    await user.click(screen.getByText(/Submit/));
    expect(screen.getByText(/Thanks for submitting your report/)).toBeInTheDocument();
  });
});

import React from 'react';

import { normalizeAccount } from 'soapbox/normalizers';
import { createComponent } from 'soapbox/test_helpers';

import DisplayName from '../display_name';

describe('<DisplayName />', () => {
  it('renders display name + account name', () => {
    const account = normalizeAccount({ acct: 'bar@baz' });
    const component = createComponent(<DisplayName account={account} />);
    const tree      = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

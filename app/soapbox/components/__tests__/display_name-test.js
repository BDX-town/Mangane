import React from 'react';
import { fromJS }  from 'immutable';
import DisplayName from '../display_name';
import { createComponent } from 'soapbox/test_helpers';

describe('<DisplayName />', () => {
  it('renders display name + account name', () => {
    const account = fromJS({
      username: 'bar',
      acct: 'bar@baz',
      display_name_html: '<p>Foo</p>',
    });
    const component = createComponent(<DisplayName account={account} />);
    const tree      = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

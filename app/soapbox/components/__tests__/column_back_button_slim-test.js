import React from 'react';
import ColumnBackButtonSlim from '../column_back_button_slim';
import { createComponentWithIntl } from 'soapbox/test_helpers';

describe('<ColumnBackButtonSlim />', () => {
  it('renders correctly', () => {
    const component = createComponentWithIntl(<ColumnBackButtonSlim />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

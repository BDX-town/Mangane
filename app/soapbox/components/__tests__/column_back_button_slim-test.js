import React from 'react';
import ColumnBackButtonSlim from '../column_back_button_slim';
import { createComponent } from 'soapbox/test_helpers';

describe('<ColumnBackButtonSlim />', () => {
  it('renders correctly', () => {
    const component = createComponent(<ColumnBackButtonSlim />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

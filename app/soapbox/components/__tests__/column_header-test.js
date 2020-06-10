import React from 'react';
import ColumnHeader from '../column_header';
import { createComponent } from 'soapbox/test_helpers';

describe('<ColumnHeader />', () => {
  it('renders correctly with minimal props', () => {
    const component = createComponent(<ColumnHeader />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

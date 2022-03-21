import React from 'react';

import { createShallowComponent } from 'soapbox/test_helpers';

import Form from '../form';

describe('<Form />', () => {
  it('renders children', () => {
    const onSubmitMock = jest.fn();
    const component = createShallowComponent(
      <Form onSubmit={onSubmitMock}>children</Form>,
    );

    expect(component.text()).toContain('children');
  });

  it('handles onSubmit prop', () => {
    const onSubmitMock = jest.fn();
    const component = createShallowComponent(
      <Form onSubmit={onSubmitMock}>children</Form>,
    );

    component.find('form').at(0).simulate('submit', {
      preventDefault: () => {},
    });
    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('handles disabled prop', () => {
    const onSubmitMock = jest.fn();
    const component = createShallowComponent(
      <Form onSubmit={onSubmitMock} disabled>
        <button type='submit'>Submit</button>
      </Form>,
    );

    component.find('button').at(0).simulate('click');
    expect(onSubmitMock).not.toHaveBeenCalled();
  });
});

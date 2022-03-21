import React from 'react';

import { createShallowComponent } from 'soapbox/test_helpers';

jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
}));

import FormGroup from '../form-group';

describe('<FormGroup />', () => {
  it('connects the label and input', () => {
    const component = createShallowComponent(
      <FormGroup labelText='My label'>
        <input type='text' />
      </FormGroup>,
    );
    const otherComponent = createShallowComponent(
      <FormGroup labelText='My other label'>
        <input type='text' />
      </FormGroup>,
    );

    const inputId = component.find('input').at(0).prop('id');
    const labelId = component.find('label').at(0).prop('htmlFor');
    expect(inputId).toBe(labelId);

    const otherInputId = otherComponent.find('input').at(0).prop('id');
    expect(otherInputId).not.toBe(inputId);
  });

  it('renders errors', () => {
    const component = createShallowComponent(
      <FormGroup labelText='My label' errors={['is invalid', 'is required']}>
        <input type='text' />
      </FormGroup>,
    );

    expect(component.text()).toContain('is invalid, is required');
  });

  it('renders label', () => {
    const component = createShallowComponent(
      <FormGroup labelText='My label'>
        <input type='text' />
      </FormGroup>,
    );

    expect(component.text()).toContain('My label');
  });

  it('renders hint', () => {
    const component = createShallowComponent(
      <FormGroup labelText='My label' hintText='My hint'>
        <input type='text' />
      </FormGroup>,
    );

    expect(component.text()).toContain('My hint');
  });
});

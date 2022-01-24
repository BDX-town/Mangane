import React from 'react';
import renderer from 'react-test-renderer';

import {
  InputContainer,
  SimpleInput,
  SimpleForm,
  FieldsGroup,
  Checkbox,
  RadioGroup,
  SelectDropdown,
  TextInput,
  FileChooser,
} from '..';

describe('<InputContainer />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <InputContainer />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<SimpleInput />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <SimpleInput />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<SimpleForm />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <SimpleForm />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<FieldsGroup />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <FieldsGroup />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<Checkbox />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <Checkbox />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<RadioGroup />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <RadioGroup />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<SelectDropdown />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <SelectDropdown items={{ one: 'One', two: 'Two', three: 'Three' }} />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<TextInput />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <TextInput />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<FileChooser />', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <FileChooser />,
    ).toJSON()).toMatchSnapshot();
  });
});

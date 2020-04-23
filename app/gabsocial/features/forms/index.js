import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

export const InputContainer = (props) => {
  const containerClass = classNames('input', {
    'with_label': props.label,
    'required': props.required,
    'boolean': props.type === 'checkbox',
  }, props.extraClass);

  return (
    <div className={containerClass}>
      {props.children}
      {props.hint && <span className='hint'>{props.hint}</span>}
    </div>
  );
};

InputContainer.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  extraClass: PropTypes.string,
};

export const LabelInputContainer = ({ label, children, ...props }) => {
  const id = uuidv4();
  const childrenWithProps = React.Children.map(children, child => (
    React.cloneElement(child, { id: id })
  ));

  return (
    <div className='label_input'>
      <label htmlFor={id}>{label}</label>
      <div className='label_input__wrapper'>
        {childrenWithProps}
      </div>
    </div>
  );
};

LabelInputContainer.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export const LabelInput = ({ label, ...props }) => (
  <LabelInputContainer label={label}>
    <input {...props} />
  </LabelInputContainer>
);

LabelInput.propTypes = {
  label: PropTypes.string.isRequired,
};

export class SimpleInput extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
  }

  render() {
    const { hint, ...props } = this.props;
    const Input = this.props.label ? LabelInput : 'input';

    return (
      <InputContainer {...this.props}>
        <Input {...props} />
      </InputContainer>
    );
  }

}

export const SimpleForm = ({ children, onSubmit }) => (
  <form className='simple_form' onSubmit={onSubmit}>{children}</form>
);

SimpleForm.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func,
};

SimpleForm.defaultProps = {
  onSubmit: e => e.preventDefault(),
};

export const FieldsGroup = ({ children }) => (
  <div className='fields-group'>{children}</div>
);

FieldsGroup.propTypes = {
  children: PropTypes.node,
};

export const Checkbox = props => (
  <SimpleInput type='checkbox' {...props} />
);

export class RadioGroup extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const { label, children, onChange } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { onChange })
    );

    return (
      <div className='input with_floating_label radio_buttons'>
        <div className='label_input'>
          <label>{label}</label>
          <ul>{childrenWithProps}</ul>
        </div>
      </div>
    );
  }

}

export class RadioItem extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
  }

  render() {
    const { label, hint, ...props } = this.props;
    const id = uuidv4();

    return (
      <li className='radio'>
        <label htmlFor={id}>
          <input id={id} type='radio' {...props} /> {label}
          {hint && <span className='hint'>{hint}</span>}
        </label>
      </li>
    );
  }

}

export class SelectDropdown extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    items: PropTypes.object.isRequired,
  }

  render() {
    const { label, items, ...props } = this.props;

    const optionElems = Object.keys(items).map(item => (
      <option key={item} value={item}>{items[item]}</option>
    ));

    const selectElem = <select {...props}>{optionElems}</select>;

    return label ? (
      <LabelInputContainer label={label}>{selectElem}</LabelInputContainer>
    ) : selectElem;
  }

}

export const TextInput = props => (
  <SimpleInput type='text' {...props} />
);

export const FileChooser = props => (
  <SimpleInput type='file' {...props} />
);

FileChooser.defaultProps = {
  accept: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

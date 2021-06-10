import React, { useState } from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

export const FormPropTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]),
};

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
  label: FormPropTypes.label,
  hint: PropTypes.node,
  required: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  extraClass: PropTypes.string,
};

export const LabelInputContainer = ({ label, hint, children, ...props }) => {
  const [id] = useState(uuidv4());
  const childrenWithProps = React.Children.map(children, child => (
    React.cloneElement(child, { id: id, key: id })
  ));

  return (
    <div className='label_input'>
      <label htmlFor={id}>{label}</label>
      <div className='label_input__wrapper'>
        {childrenWithProps}
      </div>
      {hint && <span className='hint'>{hint}</span>}
    </div>
  );
};

LabelInputContainer.propTypes = {
  label: FormPropTypes.label.isRequired,
  hint: PropTypes.node,
  children: PropTypes.node,
};

export const LabelInput = ({ label, dispatch, ...props }) => (
  <LabelInputContainer label={label}>
    <input {...props} />
  </LabelInputContainer>
);

LabelInput.propTypes = {
  label: FormPropTypes.label.isRequired,
  dispatch: PropTypes.func,
};

export const LabelTextarea = ({ label, dispatch, ...props }) => (
  <LabelInputContainer label={label}>
    <textarea {...props} />
  </LabelInputContainer>
);

LabelTextarea.propTypes = {
  label: FormPropTypes.label.isRequired,
  dispatch: PropTypes.func,
};

export class SimpleInput extends ImmutablePureComponent {

  static propTypes = {
    label: FormPropTypes.label,
    hint: PropTypes.node,
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

export class SimpleTextarea extends ImmutablePureComponent {

  static propTypes = {
    label: FormPropTypes.label,
    hint: PropTypes.node,
  }

  render() {
    const { hint, ...props } = this.props;
    const Input = this.props.label ? LabelTextarea : 'textarea';

    return (
      <InputContainer {...this.props}>
        <Input {...props} />
      </InputContainer>
    );
  }

}

export class SimpleForm extends ImmutablePureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    acceptCharset: 'UTF-8',
    onSubmit: e => {},
  };

  onSubmit = e => {
    this.props.onSubmit(e);
    e.preventDefault();
  }

  render() {
    const { children, onSubmit, ...props } = this.props;
    return (
      <form className='simple_form' method='post' onSubmit={this.onSubmit} {...props}>
        {children}
      </form>
    );
  }

}

export const FieldsGroup = ({ children }) => (
  <div className='fields-group'>{children}</div>
);

FieldsGroup.propTypes = {
  children: PropTypes.node,
};

export const Checkbox = props => (
  <SimpleInput type='checkbox' value {...props} />
);

export class RadioGroup extends ImmutablePureComponent {

  static propTypes = {
    label: FormPropTypes.label,
    children: PropTypes.node,
  }

  render() {
    const { label, children, onChange } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { onChange }),
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
    label: FormPropTypes.label,
    hint: PropTypes.node,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
  }

  state = {
    id: uuidv4(),
  }

  render() {
    const { label, hint, dispatch, ...props } = this.props;
    const { id } = this.state;

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
    label: FormPropTypes.label,
    hint: PropTypes.node,
    items: PropTypes.object.isRequired,
  }

  render() {
    const { label, hint, items, ...props } = this.props;

    const optionElems = Object.keys(items).map(item => (
      <option key={item} value={item}>{items[item]}</option>
    ));

    const selectElem = <div className='select-wrapper'><select {...props}>{optionElems}</select></div>;

    return label ? (
      <LabelInputContainer label={label} hint={hint}>{selectElem}</LabelInputContainer>
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

export const FileChooserLogo = props => (
  <SimpleInput type='file' {...props} />
);

FileChooserLogo.defaultProps = {
  accept: ['image/svg', 'image/png'],
};


export class CopyableInput extends ImmutablePureComponent {

  static propTypes = {
    value: PropTypes.string,
  }

  setInputRef = c => {
    this.input = c;
  }

  handleCopyClick = e => {
    if (!this.input) return;

    this.input.select();
    this.input.setSelectionRange(0, 99999);

    document.execCommand('copy');
  }

  render() {
    const { value } = this.props;

    return (
      <div className='copyable-input'>
        <input ref={this.setInputRef} type='text' value={value} readOnly />
        <button onClick={this.handleCopyClick}>
          <FormattedMessage id='forms.copy' defaultMessage='Copy' />
        </button>
      </div>
    );
  }

}

import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { Text, Select } from '../../components/ui';

interface IInputContainer {
  label?: React.ReactNode,
  hint?: React.ReactNode,
  required?: boolean,
  type?: string,
  extraClass?: string,
  error?: boolean,
}

export const InputContainer: React.FC<IInputContainer> = (props) => {
  const containerClass = classNames('input', {
    'with_label': props.label,
    'required': props.required,
    'boolean': props.type === 'checkbox',
    'field_with_errors': props.error,
  }, props.extraClass);

  return (
    <div className={containerClass}>
      {props.children}
      {props.hint && <span className='hint'>{props.hint}</span>}
    </div>
  );
};

interface ILabelInputContainer {
  label?: React.ReactNode,
  hint?: React.ReactNode,
}

export const LabelInputContainer: React.FC<ILabelInputContainer> = ({ label, hint, children }) => {
  const [id] = useState(uuidv4());
  const childrenWithProps = React.Children.map(children, child => (
    // @ts-ignore: not sure how to get the right type here
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

interface ILabelInput {
  label?: React.ReactNode,
}

export const LabelInput: React.FC<ILabelInput> = ({ label, ...props }) => (
  <LabelInputContainer label={label}>
    <input {...props} />
  </LabelInputContainer>
);

interface ILabelTextarea {
  label?: React.ReactNode,
}

export const LabelTextarea: React.FC<ILabelTextarea> = ({ label, ...props }) => (
  <LabelInputContainer label={label}>
    <textarea {...props} />
  </LabelInputContainer>
);

interface ISimpleInput {
  type: string,
  label?: React.ReactNode,
  hint?: React.ReactNode,
  error?: boolean,
  onChange?: React.ChangeEventHandler,
  min?: number,
  max?: number,
  pattern?: string,
  name?: string,
  placeholder?: string,
  value?: string | number,
  autoComplete?: string,
  autoCorrect?: string,
  autoCapitalize?: string,
  required?: boolean,
}

export const SimpleInput: React.FC<ISimpleInput> = (props) => {
  const { hint, error, ...rest } = props;
  const Input = props.label ? LabelInput : 'input';

  return (
    <InputContainer {...props}>
      <Input {...rest} />
    </InputContainer>
  );
};

interface ISimpleTextarea {
  label?: React.ReactNode,
  hint?: React.ReactNode,
  value?: string,
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>,
  rows?: number,
  name?: string,
  maxLength?: number,
  required?: boolean,
}

export const SimpleTextarea: React.FC<ISimpleTextarea> = (props) => {
  const { hint, label, ...rest } = props;
  const Input = label ? LabelTextarea : 'textarea';

  return (
    <InputContainer {...props}>
      <Input {...rest} />
    </InputContainer>
  );
};

interface ISimpleForm {
  className?: string,
  onSubmit?: React.FormEventHandler,
  acceptCharset?: string,
  style?: React.CSSProperties,
}

export const SimpleForm: React.FC<ISimpleForm> = (props) => {
  const {
    className,
    children,
    onSubmit = () => {},
    acceptCharset = 'UTF-8',
    ...rest
  } = props;

  const handleSubmit: React.FormEventHandler = e => {
    onSubmit(e);
    e.preventDefault();
  };

  return (
    <form
      className={classNames('simple_form', className)}
      method='post'
      onSubmit={handleSubmit}
      acceptCharset={acceptCharset}
      {...rest}
    >
      {children}
    </form>
  );
};

export const FieldsGroup: React.FC = ({ children }) => (
  <div className='fields-group'>{children}</div>
);

interface ICheckbox {
  label?: React.ReactNode,
  hint?: React.ReactNode,
  name?: string,
  checked?: boolean,
  disabled?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  required?: boolean,
}

export const Checkbox: React.FC<ICheckbox> = (props) => (
  <SimpleInput type='checkbox' {...props} />
);

interface IRadioGroup {
  label?: React.ReactNode,
  onChange?: React.ChangeEventHandler,
}

export const RadioGroup: React.FC<IRadioGroup> = (props) => {
  const { label, children, onChange } = props;

  const childrenWithProps = React.Children.map(children, child =>
    // @ts-ignore
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
};

interface IRadioItem {
  label?: React.ReactNode,
  hint?: React.ReactNode,
  value: string,
  checked: boolean,
  onChange?: React.ChangeEventHandler,
}

export const RadioItem: React.FC<IRadioItem> = (props) => {
  const { current: id } = useRef<string>(uuidv4());
  const { label, hint, checked = false, ...rest } = props;

  return (
    <li className='radio'>
      <label htmlFor={id}>
        <input id={id} type='radio' checked={checked} {...rest} />
        <Text>{label}</Text>
        {hint && <span className='hint'>{hint}</span>}
      </label>
    </li>
  );
};

interface ISelectDropdown {
  label?: React.ReactNode,
  hint?: React.ReactNode,
  items: Record<string, string>,
  defaultValue?: string,
  onChange?: React.ChangeEventHandler,
}

export const SelectDropdown: React.FC<ISelectDropdown> = (props) => {
  const { label, hint, items, ...rest } = props;

  const optionElems = Object.keys(items).map(item => (
    <option key={item} value={item}>{items[item]}</option>
  ));

  // @ts-ignore
  const selectElem = <Select {...rest}>{optionElems}</Select>;

  return label ? (
    <LabelInputContainer label={label} hint={hint}>{selectElem}</LabelInputContainer>
  ) : selectElem;
};

interface ITextInput {
  name?: string,
  onChange?: React.ChangeEventHandler,
  label?: React.ReactNode,
  hint?: React.ReactNode,
  placeholder?: string,
  value?: string,
  autoComplete?: string,
  autoCorrect?: string,
  autoCapitalize?: string,
  pattern?: string,
  error?: boolean,
  required?: boolean,
}

export const TextInput: React.FC<ITextInput> = props => (
  <SimpleInput type='text' {...props} />
);

export const FileChooser : React.FC = (props) => (
  <SimpleInput type='file' {...props} />
);

FileChooser.defaultProps = {
  accept: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

interface IFileChooserLogo {
  label?: React.ReactNode,
  hint?: React.ReactNode,
  name?: string,
  accept?: string[],
  onChange: React.ChangeEventHandler<HTMLInputElement>,
}

export const FileChooserLogo: React.FC<IFileChooserLogo> = props => (
  <SimpleInput type='file' {...props} />
);

FileChooserLogo.defaultProps = {
  accept: ['image/svg', 'image/png'],
};

interface ICopyableInput {
  value: string,
}

export const CopyableInput: React.FC<ICopyableInput> = ({ value }) => {
  const node = useRef<HTMLInputElement>(null);

  const handleCopyClick: React.MouseEventHandler = () => {
    if (!node.current) return;

    node.current.select();
    node.current.setSelectionRange(0, 99999);

    document.execCommand('copy');
  };

  return (
    <div className='copyable-input'>
      <input ref={node} type='text' value={value} readOnly />
      <button className='p-2 text-white bg-primary-600' onClick={handleCopyClick}>
        <FormattedMessage id='forms.copy' defaultMessage='Copy' />
      </button>
    </div>
  );
};

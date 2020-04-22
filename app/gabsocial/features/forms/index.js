import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export class SimpleForm extends ImmutablePureComponent {

  static propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: e => e.preventDefault(),
  }

  render() {
    const { children, onSubmit } = this.props;

    return (
      <form className='simple_form' onSubmit={onSubmit}>
        {children}
      </form>
    );
  }

}

export class FieldsGroup extends ImmutablePureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className='fields-group'>
        {children}
      </div>
    );
  }

}

export class Checkbox extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
  }

  render() {
    const { label, name, checked, onChange } = this.props;
    const id = uuidv4();

    return (
      <div className='input with_label boolean optional'>
        <div className='label_input'>
          <label className='boolean optional' htmlFor={id}>
            {label}
          </label>
          <div className='label_input__wrapper'>
            <label className='checkbox'>
              <input
                id={id}
                name={name}
                className='boolean optional'
                type='checkbox'
                checked={checked}
                onChange={onChange}
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

}

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
      <div className='input with_floating_label radio_buttons optional user_setting_default_privacy'>
        <div className='label_input'>
          <label className='radio_buttons optional'>{label}</label>
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
    const { label, hint, value, checked, onChange } = this.props;
    const id = uuidv4();

    return (
      <li className='radio'>
        <label htmlFor={id}>
          <input
            id={id}
            className='radio_buttons optional'
            type='radio'
            checked={checked}
            onChange={onChange}
            value={value}
          /> {label}
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
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    const { label, items, defaultValue, onChange } = this.props;
    const id = uuidv4();

    return (
      <div className='input with_label select optional'>
        <div className='label_input'>
          <label className='select optional' htmlFor={id}>{label}</label>
          <div className='label_input__wrapper'>
            <select
              id={id}
              className='select optional'
              onChange={onChange}
              defaultValue={defaultValue}
            >
              {Object.keys(items).map(item => (
                <option key={item} value={item}>
                  {items[item]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

}

export class TextInput extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    maxLength: PropTypes.number,
  }

  render() {
    const { label, maxLength, ...props } = this.props;
    const id = uuidv4();

    return (
      <div className='input with_label string optional'>
        <div className='label_input'>
          <label className='string optional' htmlFor={id}>{label}</label>
          <div className='label_input__wrapper'>
            <input
              maxlength={maxLength}
              className='string optional'
              size={maxLength}
              type='text'
              id={id}
              {...props}
            />
          </div>
        </div>
      </div>
    );
  }

}

export class FileChooser extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    hint: PropTypes.string,
    fileTypes: PropTypes.array,
  }

  static defaultProps = {
    fileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  }

  render() {
    const { label, hint, fileTypes, ...props } = this.props;
    const id = uuidv4();

    return (
      <div className='input with_label file optional field_with_hint'>
        <div className='label_input'>
          <label className='file optional' htmlFor={id}>{label}</label>
          <div className='label_input__wrapper'>
            <input
              id={id}
              accept={fileTypes.join(',')}
              className='file optional'
              type='file'
              {...props}
            />
          </div>
        </div>
        <span className='hint'>{hint}</span>
      </div>
    );
  }

}

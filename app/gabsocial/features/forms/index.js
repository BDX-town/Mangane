import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export class SimpleForm extends ImmutablePureComponent {

  static propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.function,
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
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
  }

  render() {
    const { label, checked, onChange } = this.props;
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

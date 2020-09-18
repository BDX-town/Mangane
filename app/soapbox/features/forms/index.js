import React, { useState } from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { SketchPicker } from 'react-color';
import Overlay from 'react-overlays/lib/Overlay';
import { isMobile } from '../../is_mobile';
import detectPassiveEvents from 'detect-passive-events';

const FormPropTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]),
};

const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false;

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

export class ColorPicker extends React.PureComponent {

  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  }

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  render() {
    const { style, value, onChange } = this.props;
    let margin_left_picker = isMobile(window.innerWidth) ? '20px' : '12px';

    return (
      <div id='SketchPickerContainer' ref={this.setRef} style={{ ...style, marginLeft: margin_left_picker, position: 'absolute', zIndex: 1000 }}>
        <SketchPicker color={value} disableAlpha onChange={onChange} />
      </div>
    );
  }

}

export class ColorWithPicker extends ImmutablePureComponent {

  static propTypes = {
    buttonId: PropTypes.string.isRequired,
    label: FormPropTypes.label,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onToggle = (e) => {
    if (!e.key || e.key === 'Enter') {
      if (this.state.active) {
        this.onHidePicker();
      } else {
        this.onShowPicker(e);
      }
    }
  }

  state = {
    active: false,
    placement: null,
  }

  onHidePicker = () => {
    this.setState({ active: false });
  }

  onShowPicker = ({ target }) => {
    this.setState({ active: true });
    this.setState({ placement: isMobile(window.innerWidth) ? 'bottom' : 'right' });
  }

  render() {
    const { buttonId, label, value, onChange } = this.props;
    const { active, placement } = this.state;

    return (
      <div className='label_input__color'>
        <label>{label}</label>
        <div id={buttonId} className='color-swatch' role='presentation' style={{ background: value }} title={value} value={value} onClick={this.onToggle} />
        <Overlay show={active} placement={placement} target={this}>
          <ColorPicker value={value} onChange={onChange} onClose={this.onHidePicker} />
        </Overlay>
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

    const selectElem = <select {...props}>{optionElems}</select>;

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

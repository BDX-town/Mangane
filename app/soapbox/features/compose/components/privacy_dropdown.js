import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import spring from 'react-motion/lib/spring';
import Overlay from 'react-overlays/lib/Overlay';

import Icon from 'soapbox/components/icon';

import { IconButton } from '../../../components/ui';
import Motion from '../../ui/util/optional_motion';

const messages = defineMessages({
  public_short: { id: 'privacy.public.short', defaultMessage: 'Public' },
  public_long: { id: 'privacy.public.long', defaultMessage: 'Post to public timelines' },
  unlisted_short: { id: 'privacy.unlisted.short', defaultMessage: 'Unlisted' },
  unlisted_long: { id: 'privacy.unlisted.long', defaultMessage: 'Do not post to public timelines' },
  private_short: { id: 'privacy.private.short', defaultMessage: 'Followers-only' },
  private_long: { id: 'privacy.private.long', defaultMessage: 'Post to followers only' },
  direct_short: { id: 'privacy.direct.short', defaultMessage: 'Direct' },
  direct_long: { id: 'privacy.direct.long', defaultMessage: 'Post to mentioned users only' },
  change_privacy: { id: 'privacy.change', defaultMessage: 'Adjust post privacy' },
});

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

class PrivacyDropdownMenu extends React.PureComponent {

  static propTypes = {
    style: PropTypes.object,
    items: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    unavailable: PropTypes.bool,
  };

  state = {
    mounted: false,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  handleKeyDown = e => {
    const { items } = this.props;
    const value = e.currentTarget.getAttribute('data-index');
    const index = items.findIndex(item => {
      return (item.value === value);
    });
    let element = null;

    switch (e.key) {
      case 'Escape':
        this.props.onClose();
        break;
      case 'Enter':
        this.handleClick(e);
        break;
      case 'ArrowDown':
        element = this.node.childNodes[index + 1] || this.node.firstChild;
        break;
      case 'ArrowUp':
        element = this.node.childNodes[index - 1] || this.node.lastChild;
        break;
      case 'Tab':
        if (e.shiftKey) {
          element = this.node.childNodes[index - 1] || this.node.lastChild;
        } else {
          element = this.node.childNodes[index + 1] || this.node.firstChild;
        }
        break;
      case 'Home':
        element = this.node.firstChild;
        break;
      case 'End':
        element = this.node.lastChild;
        break;
    }

    if (element) {
      element.focus();
      this.props.onChange(element.getAttribute('data-index'));
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleClick = e => {
    const value = e.currentTarget.getAttribute('data-index');

    e.preventDefault();

    this.props.onClose();
    this.props.onChange(value);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
    if (this.focusedItem) this.focusedItem.focus({ preventScroll: true });
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  setFocusRef = c => {
    this.focusedItem = c;
  }

  render() {
    const { mounted } = this.state;
    const { style, items, placement, value } = this.props;

    return (
      <Motion defaultStyle={{ opacity: 0, scaleX: 0.85, scaleY: 0.75 }} style={{ opacity: spring(1, { damping: 35, stiffness: 400 }), scaleX: spring(1, { damping: 35, stiffness: 400 }), scaleY: spring(1, { damping: 35, stiffness: 400 }) }}>
        {({ opacity, scaleX, scaleY }) => (
          // It should not be transformed when mounting because the resulting
          // size will be used to determine the coordinate of the menu by
          // react-overlays
          <div className={`privacy-dropdown__dropdown ${placement}`} style={{ ...style, opacity: opacity, transform: mounted ? `scale(${scaleX}, ${scaleY})` : null }} role='listbox' ref={this.setRef}>
            {items.map(item => (
              <div role='option' tabIndex='0' key={item.value} data-index={item.value} onKeyDown={this.handleKeyDown} onClick={this.handleClick} className={classNames('privacy-dropdown__option', { active: item.value === value })} aria-selected={item.value === value} ref={item.value === value ? this.setFocusRef : null}>
                <div className='privacy-dropdown__option__icon'>
                  <Icon src={item.icon} />
                </div>

                <div className='privacy-dropdown__option__content'>
                  <strong>{item.text}</strong>
                  {item.meta}
                </div>
              </div>
            ))}
          </div>
        )}
      </Motion>
    );
  }

}

export default @injectIntl
class PrivacyDropdown extends React.PureComponent {

  static propTypes = {
    isUserTouching: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    onModalOpen: PropTypes.func,
    onModalClose: PropTypes.func,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    open: false,
    placement: 'bottom',
  };

  constructor(props) {
    super(props);
    const { intl: { formatMessage } } = props;

    this.options = [
      { icon: require('@tabler/icons/icons/world.svg'), value: 'public', text: formatMessage(messages.public_short), meta: formatMessage(messages.public_long) },
      { icon: require('@tabler/icons/icons/lock-open.svg'), value: 'unlisted', text: formatMessage(messages.unlisted_short), meta: formatMessage(messages.unlisted_long) },
      { icon: require('@tabler/icons/icons/lock.svg'), value: 'private', text: formatMessage(messages.private_short), meta: formatMessage(messages.private_long) },
      { icon: require('@tabler/icons/icons/mail.svg'), value: 'direct', text: formatMessage(messages.direct_short), meta: formatMessage(messages.direct_long) },
    ];
  }

  handleToggle = ({ target }) => {
    if (this.props.isUserTouching()) {
      if (this.state.open) {
        this.props.onModalClose();
      } else {
        this.props.onModalOpen({
          actions: this.options.map(option => ({ ...option, active: option.value === this.props.value })),
          onClick: this.handleModalActionClick,
        });
      }
    } else {
      const { top } = target.getBoundingClientRect();
      if (this.state.open && this.activeElement) {
        this.activeElement.focus();
      }
      this.setState({ placement: top * 2 < innerHeight ? 'bottom' : 'top' });
      this.setState({ open: !this.state.open });
    }
  }

  handleModalActionClick = (e) => {
    e.preventDefault();

    const { value } = this.options[e.currentTarget.getAttribute('data-index')];

    this.props.onModalClose();
    this.props.onChange(value);
  }

  handleKeyDown = e => {
    switch (e.key) {
      case 'Escape':
        this.handleClose();
        break;
    }
  }

  handleMouseDown = () => {
    if (!this.state.open) {
      this.activeElement = document.activeElement;
    }
  }

  handleButtonKeyDown = (e) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        this.handleMouseDown();
        break;
    }
  }

  handleClose = () => {
    if (this.state.open && this.activeElement) {
      this.activeElement.focus();
    }
    this.setState({ open: false });
  }

  handleChange = value => {
    this.props.onChange(value);
  }

  render() {
    const { value, intl, unavailable } = this.props;
    const { open, placement } = this.state;

    if (unavailable) {
      return null;
    }

    const valueOption = this.options.find(item => item.value === value);

    return (
      <div className={classNames('privacy-dropdown', placement, { active: open })} onKeyDown={this.handleKeyDown}>
        <div className={classNames('privacy-dropdown__value', { active: this.options.indexOf(valueOption) === 0 })}>
          <IconButton
            className='text-gray-400 hover:text-gray-600'
            src={valueOption.icon}
            title={intl.formatMessage(messages.change_privacy)}
            onClick={this.handleToggle}
            onMouseDown={this.handleMouseDown}
            onKeyDown={this.handleButtonKeyDown}
          />
        </div>

        <Overlay show={open} placement={placement} target={this}>
          <PrivacyDropdownMenu
            items={this.options}
            value={value}
            onClose={this.handleClose}
            onChange={this.handleChange}
            placement={placement}
          />
        </Overlay>
      </div>
    );
  }

}

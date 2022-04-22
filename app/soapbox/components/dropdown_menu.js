import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import spring from 'react-motion/lib/spring';
import Overlay from 'react-overlays/lib/Overlay';
import { withRouter } from 'react-router-dom';

import Icon from 'soapbox/components/icon';

import Motion from '../features/ui/util/optional_motion';

import IconButton from './icon_button';

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;
let id = 0;

@withRouter
class DropdownMenu extends React.PureComponent {

  static propTypes = {
    items: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    style: PropTypes.object,
    placement: PropTypes.string,
    arrowOffsetLeft: PropTypes.string,
    arrowOffsetTop: PropTypes.string,
    openedViaKeyboard: PropTypes.bool,
    history: PropTypes.object,
  };

  static defaultProps = {
    style: {},
    placement: 'bottom',
  };

  state = {
    mounted: false,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
    if (this.focusedItem && this.props.openedViaKeyboard) {
      this.focusedItem.focus({ preventScroll: true });
    }
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  setFocusRef = c => {
    this.focusedItem = c;
  }

  handleKeyDown = e => {
    const items = Array.from(this.node.getElementsByTagName('a'));
    const index = items.indexOf(document.activeElement);
    let element = null;

    switch(e.key) {
    case 'ArrowDown':
      element = items[index+1] || items[0];
      break;
    case 'ArrowUp':
      element = items[index-1] || items[items.length-1];
      break;
    case 'Tab':
      if (e.shiftKey) {
        element = items[index-1] || items[items.length-1];
      } else {
        element = items[index+1] || items[0];
      }
      break;
    case 'Home':
      element = items[0];
      break;
    case 'End':
      element = items[items.length-1];
      break;
    case 'Escape':
      this.props.onClose();
      break;
    }

    if (element) {
      element.focus();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleItemKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.handleClick(e);
    }
  }

  handleClick = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const { action, to } = this.props.items[i];

    this.props.onClose();

    if (typeof action === 'function') {
      e.preventDefault();
      action(e);
    } else if (to) {
      e.preventDefault();
      this.props.history.push(to);
    }
  }

  handleMiddleClick = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const { middleClick } = this.props.items[i];

    this.props.onClose();

    if (e.button === 1 && typeof middleClick === 'function') {
      e.preventDefault();
      middleClick(e);
    }
  }

  handleAuxClick = e => {
    if (e.button === 1) {
      this.handleMiddleClick(e);
    }
  }

  renderItem(option, i) {
    if (option === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { text, href, to, newTab, isLogout, icon, destructive } = option;

    return (
      <li className={classNames('dropdown-menu__item', { destructive })} key={`${text}-${i}`}>
        <a
          href={href || to || '#'}
          role='button'
          tabIndex='0'
          ref={i === 0 ? this.setFocusRef : null}
          onClick={this.handleClick}
          onAuxClick={this.handleAuxClick}
          onKeyPress={this.handleItemKeyPress}
          data-index={i}
          target={newTab ? '_blank' : null}
          data-method={isLogout ? 'delete' : null}
        >
          {icon && <Icon src={icon} />}
          {text}
        </a>
      </li>
    );
  }

  render() {
    const { items, style, placement, arrowOffsetLeft, arrowOffsetTop } = this.props;
    const { mounted } = this.state;
    return (
      <Motion defaultStyle={{ opacity: 0, scaleX: 1, scaleY: 1 }} style={{ opacity: spring(1, { damping: 35, stiffness: 400 }), scaleX: spring(1, { damping: 35, stiffness: 400 }), scaleY: spring(1, { damping: 35, stiffness: 400 }) }}>
        {({ opacity, scaleX, scaleY }) => (
          // It should not be transformed when mounting because the resulting
          // size will be used to determine the coordinate of the menu by
          // react-overlays
          <div className={`dropdown-menu ${placement}`} style={{ ...style, opacity: opacity, transform: mounted ? `scale(${scaleX}, ${scaleY})` : null }} ref={this.setRef}>
            <div className={`dropdown-menu__arrow ${placement}`} style={{ left: arrowOffsetLeft, top: arrowOffsetTop }} />
            <ul>
              {items.map((option, i) => this.renderItem(option, i))}
            </ul>
          </div>
        )}
      </Motion>
    );
  }

}

export default @withRouter
class Dropdown extends React.PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    src: PropTypes.string,
    items: PropTypes.array.isRequired,
    size: PropTypes.number,
    active: PropTypes.bool,
    pressed: PropTypes.bool,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    status: ImmutablePropTypes.map,
    isUserTouching: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    dropdownPlacement: PropTypes.string,
    openDropdownId: PropTypes.number,
    openedViaKeyboard: PropTypes.bool,
    text: PropTypes.string,
    onShiftClick: PropTypes.func,
    history: PropTypes.object,
  };

  static defaultProps = {
    title: 'Menu',
  };

  state = {
    id: id++,
  };

  handleClick = e => {
    const { onOpen, onShiftClick, openDropdownId } = this.props;

    if (onShiftClick && e.shiftKey) {
      e.preventDefault();
      onShiftClick(e);
    } else if (this.state.id === openDropdownId) {
      this.handleClose();
    } else {
      const { top } = e.target.getBoundingClientRect();
      const placement = top * 2 < innerHeight ? 'bottom' : 'top';

      onOpen(this.state.id, this.handleItemClick, placement, e.type !== 'click');
    }
  }

  handleClose = () => {
    if (this.activeElement) {
      this.activeElement.focus();
      this.activeElement = null;
    }
    this.props.onClose(this.state.id);
  }

  handleMouseDown = () => {
    if (!this.state.open) {
      this.activeElement = document.activeElement;
    }
  }

  handleButtonKeyDown = (e) => {
    switch(e.key) {
    case ' ':
    case 'Enter':
      this.handleMouseDown();
      break;
    }
  }

  handleKeyPress = (e) => {
    switch(e.key) {
    case ' ':
    case 'Enter':
      this.handleClick(e);
      e.stopPropagation();
      e.preventDefault();
      break;
    }
  }

  handleItemClick = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const { action, to } = this.props.items[i];

    this.handleClose();

    if (typeof action === 'function') {
      e.preventDefault();
      action();
    } else if (to) {
      e.preventDefault();
      this.props.history.push(to);
    }
  }

  setTargetRef = c => {
    this.target = c;
  }

  findTarget = () => {
    return this.target;
  }

  componentWillUnmount = () => {
    if (this.state.id === this.props.openDropdownId) {
      this.handleClose();
    }
  }

  render() {
    const { icon, src, items, size, title, disabled, dropdownPlacement, openDropdownId, openedViaKeyboard, active, pressed, text } = this.props;
    const open = this.state.id === openDropdownId;

    return (
      <div>
        <IconButton
          icon={icon}
          src={src}
          title={title}
          active={open || active}
          pressed={pressed}
          disabled={disabled}
          size={size}
          text={text}
          ref={this.setTargetRef}
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          onKeyDown={this.handleButtonKeyDown}
          onKeyPress={this.handleKeyPress}
        />

        <Overlay show={open} placement={dropdownPlacement} target={this.findTarget}>
          <DropdownMenu items={items} onClose={this.handleClose} openedViaKeyboard={openedViaKeyboard} />
        </Overlay>
      </div>
    );
  }

}

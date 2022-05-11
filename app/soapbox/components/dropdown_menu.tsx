import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import React from 'react';
import { spring } from 'react-motion';
// @ts-ignore: TODO: upgrade react-overlays. v3.1 and above have TS definitions
import Overlay from 'react-overlays/lib/Overlay';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { IconButton, Counter } from 'soapbox/components/ui';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';
import Motion from 'soapbox/features/ui/util/optional_motion';

import type { Status } from 'soapbox/types/entities';

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;
let id = 0;

export interface MenuItem {
  action?: React.EventHandler<React.KeyboardEvent | React.MouseEvent>,
  middleClick?: React.EventHandler<React.MouseEvent>,
  text: string | JSX.Element,
  href?: string,
  to?: string,
  newTab?: boolean,
  isLogout?: boolean,
  icon: string,
  count?: number,
  destructive?: boolean,
}

export type Menu = Array<MenuItem | null>;

interface IDropdownMenu extends RouteComponentProps {
  items: Menu,
  onClose: () => void,
  style?: React.CSSProperties,
  placement?: DropdownPlacement,
  arrowOffsetLeft?: string,
  arrowOffsetTop?: string,
  openedViaKeyboard: boolean,
}

interface IDropdownMenuState {
  mounted: boolean,
}

class DropdownMenu extends React.PureComponent<IDropdownMenu, IDropdownMenuState> {

  static defaultProps: Partial<IDropdownMenu> = {
    style: {},
    placement: 'bottom',
  };

  state = {
    mounted: false,
  };

  node: HTMLDivElement | null = null;
  focusedItem: HTMLAnchorElement | null = null;

  handleDocumentClick = (e: Event) => {
    if (this.node && !this.node.contains(e.target as Node)) {
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
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('touchend', this.handleDocumentClick);
  }

  setRef: React.RefCallback<HTMLDivElement> = c => {
    this.node = c;
  }

  setFocusRef: React.RefCallback<HTMLAnchorElement> = c => {
    this.focusedItem = c;
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (!this.node) return;

    const items = Array.from(this.node.getElementsByTagName('a'));
    const index = items.indexOf(document.activeElement as any);
    let element = null;

    switch (e.key) {
      case 'ArrowDown':
        element = items[index + 1] || items[0];
        break;
      case 'ArrowUp':
        element = items[index - 1] || items[items.length - 1];
        break;
      case 'Tab':
        if (e.shiftKey) {
          element = items[index - 1] || items[items.length - 1];
        } else {
          element = items[index + 1] || items[0];
        }
        break;
      case 'Home':
        element = items[0];
        break;
      case 'End':
        element = items[items.length - 1];
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

  handleItemKeyPress: React.EventHandler<React.KeyboardEvent> = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.handleClick(e);
    }
  }

  handleClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent> = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const item = this.props.items[i];
    if (!item) return;
    const { action, to } = item;

    this.props.onClose();

    if (typeof action === 'function') {
      e.preventDefault();
      action(e);
    } else if (to) {
      e.preventDefault();
      this.props.history.push(to);
    }
  }

  handleMiddleClick: React.EventHandler<React.MouseEvent> = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const item = this.props.items[i];
    if (!item) return;
    const { middleClick } = item;

    this.props.onClose();

    if (e.button === 1 && typeof middleClick === 'function') {
      e.preventDefault();
      middleClick(e);
    }
  }

  handleAuxClick: React.EventHandler<React.MouseEvent> = e => {
    if (e.button === 1) {
      this.handleMiddleClick(e);
    }
  }

  renderItem(option: MenuItem | null, i: number): JSX.Element {
    if (option === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { text, href, to, newTab, isLogout, icon, count, destructive } = option;

    return (
      <li className={classNames('dropdown-menu__item truncate', { destructive })} key={`${text}-${i}`}>
        <a
          href={href || to || '#'}
          role='button'
          tabIndex={0}
          ref={i === 0 ? this.setFocusRef : null}
          onClick={this.handleClick}
          onAuxClick={this.handleAuxClick}
          onKeyPress={this.handleItemKeyPress}
          data-index={i}
          target={newTab ? '_blank' : undefined}
          data-method={isLogout ? 'delete' : undefined}
        >
          {icon && <SvgIcon src={icon} className='mr-3 h-5 w-5 flex-none' />}

          <span className='truncate'>{text}</span>

          {count ? (
            <span className='ml-auto h-5 w-5 flex-none'>
              <Counter count={count} />
            </span>
          ) : null}
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
          <div className={`dropdown-menu ${placement}`} style={{ ...style, opacity: opacity, transform: mounted ? `scale(${scaleX}, ${scaleY})` : undefined }} ref={this.setRef}>
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

const RouterDropdownMenu = withRouter(DropdownMenu);

export interface IDropdown extends RouteComponentProps {
  icon?: string,
  src?: string,
  items: Menu,
  size?: number,
  active?: boolean,
  pressed?: boolean,
  title?: string,
  disabled?: boolean,
  status?: Status,
  isUserTouching?: () => boolean,
  isModalOpen?: boolean,
  onOpen?: (
    id: number,
    onItemClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
    dropdownPlacement: DropdownPlacement,
    keyboard: boolean,
  ) => void,
  onClose?: (id: number) => void,
  dropdownPlacement?: string,
  openDropdownId?: number,
  openedViaKeyboard?: boolean,
  text?: string,
  onShiftClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
  children?: JSX.Element,
}

interface IDropdownState {
  id: number,
  open: boolean,
}

export type DropdownPlacement = 'top' | 'bottom';

class Dropdown extends React.PureComponent<IDropdown, IDropdownState> {

  static defaultProps: Partial<IDropdown> = {
    title: 'Menu',
  };

  state = {
    id: id++,
    open: false,
  };

  target: HTMLButtonElement | null = null;
  activeElement: Element | null = null;

  handleClick: React.EventHandler<React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>> = e => {
    const { onOpen, onShiftClick, openDropdownId } = this.props;
    e.stopPropagation();

    if (onShiftClick && e.shiftKey) {
      e.preventDefault();
      onShiftClick(e);
    } else if (this.state.id === openDropdownId) {
      this.handleClose();
    } else if (onOpen) {
      const { top } = e.currentTarget.getBoundingClientRect();
      const placement: DropdownPlacement = top * 2 < innerHeight ? 'bottom' : 'top';

      onOpen(this.state.id, this.handleItemClick, placement, e.type !== 'click');
    }
  }

  handleClose = () => {
    if (this.activeElement && this.activeElement === this.target) {
      (this.activeElement as HTMLButtonElement).focus();
      this.activeElement = null;
    }

    if (this.props.onClose) {
      this.props.onClose(this.state.id);
    }
  }

  handleMouseDown: React.EventHandler<React.MouseEvent | React.KeyboardEvent> = () => {
    if (!this.state.open) {
      this.activeElement = document.activeElement;
    }
  }

  handleButtonKeyDown: React.EventHandler<React.KeyboardEvent> = (e) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        this.handleMouseDown(e);
        break;
    }
  }

  handleKeyPress: React.EventHandler<React.KeyboardEvent<HTMLButtonElement>> = (e) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        this.handleClick(e);
        e.stopPropagation();
        e.preventDefault();
        break;
    }
  }

  handleItemClick: React.EventHandler<React.MouseEvent> = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const item = this.props.items[i];
    if (!item) return;

    const { action, to } = item;

    this.handleClose();
    e.preventDefault();
    e.stopPropagation();

    if (typeof action === 'function') {
      action(e);
    } else if (to) {
      this.props.history?.push(to);
    }
  }

  setTargetRef: React.RefCallback<HTMLButtonElement> = c => {
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
    const { src = require('@tabler/icons/icons/dots.svg'), items, title, disabled, dropdownPlacement, openDropdownId, openedViaKeyboard = false, pressed, text, children } = this.props;
    const open = this.state.id === openDropdownId;

    return (
      <>
        {children ? (
          React.cloneElement(children, {
            disabled,
            onClick: this.handleClick,
            onMouseDown: this.handleMouseDown,
            onKeyDown: this.handleButtonKeyDown,
            onKeyPress: this.handleKeyPress,
            ref: this.setTargetRef,
          })
        ) : (
          <IconButton
            disabled={disabled}
            className={classNames({
              'text-gray-400 hover:text-gray-600': true,
              'text-gray-600': open,
            })}
            title={title}
            src={src}
            aria-pressed={pressed}
            text={text}
            onClick={this.handleClick}
            onMouseDown={this.handleMouseDown}
            onKeyDown={this.handleButtonKeyDown}
            onKeyPress={this.handleKeyPress}
            ref={this.setTargetRef}
          />
        )}

        <Overlay show={open} placement={dropdownPlacement} target={this.findTarget}>
          <RouterDropdownMenu items={items} onClose={this.handleClose} openedViaKeyboard={openedViaKeyboard} />
        </Overlay>
      </>
    );
  }

}

export default withRouter(Dropdown);

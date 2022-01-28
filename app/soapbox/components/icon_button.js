import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import spring from 'react-motion/lib/spring';

import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';

import Motion from '../features/ui/util/optional_motion';

export default class IconButton extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    src: PropTypes.string,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyPress: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    size: PropTypes.number,
    active: PropTypes.bool,
    pressed: PropTypes.bool,
    expanded: PropTypes.bool,
    style: PropTypes.object,
    activeStyle: PropTypes.object,
    disabled: PropTypes.bool,
    inverted: PropTypes.bool,
    animate: PropTypes.bool,
    overlay: PropTypes.bool,
    tabIndex: PropTypes.string,
    text: PropTypes.string,
    emoji: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    size: 18,
    active: false,
    disabled: false,
    animate: false,
    overlay: false,
    tabIndex: '0',
    onKeyUp: () => {},
    onKeyDown: () => {},
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    type: 'button',
  };

  handleClick = (e) =>  {
    e.preventDefault();

    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  }

  handleMouseDown = (e) => {
    if (!this.props.disabled && this.props.onMouseDown) {
      this.props.onMouseDown(e);
    }
  }

  handleKeyDown = (e) => {
    if (!this.props.disabled && this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleKeyUp = (e) => {
    if (!this.props.disabled && this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  }

  handleKeyPress = (e) => {
    if (this.props.onKeyPress && !this.props.disabled) {
      this.props.onKeyPress(e);
    }
  }

  render() {
    const style = {
      fontSize: `${this.props.size}px`,
      width: `${this.props.size * 1.28571429}px`,
      height: `${this.props.size * 1.28571429}px`,
      lineHeight: `${this.props.size}px`,
      ...this.props.style,
      ...(this.props.active ? this.props.activeStyle : {}),
    };

    const {
      active,
      animate,
      className,
      disabled,
      expanded,
      icon,
      src,
      inverted,
      overlay,
      pressed,
      tabIndex,
      title,
      text,
      emoji,
      type,
    } = this.props;

    const classes = classNames(className, 'icon-button', {
      active,
      disabled,
      inverted,
      overlayed: overlay,
    });

    if (!animate) {
      // Perf optimization: avoid unnecessary <Motion> components unless
      // we actually need to animate.
      return (
        <button
          aria-label={title}
          aria-pressed={pressed}
          aria-expanded={expanded}
          title={title}
          className={classes}
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          onKeyPress={this.handleKeyPress}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          tabIndex={tabIndex}
          disabled={disabled}
          type={type}
        >
          <div style={src ? {} : style}>
            {emoji
              ? <div className='icon-button__emoji' dangerouslySetInnerHTML={{ __html: emojify(emoji) }} aria-hidden='true' />
              : <Icon id={icon} src={src} fixedWidth aria-hidden='true' />}
          </div>
          {text && <span className='icon-button__text'>{text}</span>}
        </button>
      );
    }

    return (
      <Motion defaultStyle={{ rotate: active ? -360 : 0 }} style={{ rotate: animate ? spring(active ? -360 : 0, { stiffness: 120, damping: 7 }) : 0 }}>
        {({ rotate }) => (
          <button
            aria-label={title}
            aria-pressed={pressed}
            aria-expanded={expanded}
            title={title}
            className={classes}
            onClick={this.handleClick}
            onMouseDown={this.handleMouseDown}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            onKeyPress={this.handleKeyPress}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
            tabIndex={tabIndex}
            disabled={disabled}
            type={type}
          >
            <div style={src ? {} : style}>
              {emoji
                ? <div className='icon-button__emoji' style={{ transform: `rotate(${rotate}deg)` }} dangerouslySetInnerHTML={{ __html: emojify(emoji) }} aria-hidden='true' />
                : <Icon id={icon} src={src} style={{ transform: `rotate(${rotate}deg)` }} fixedWidth aria-hidden='true' />}
            </div>
            {text && <span className='icon-button__text'>{text}</span>}
          </button>
        )}
      </Motion>
    );
  }

}

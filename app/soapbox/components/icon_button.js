import React from 'react';
import Motion from '../features/ui/util/optional_motion';
import spring from 'react-motion/lib/spring';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';
import AnimatedNumber from 'soapbox/components/animated_number';

export default class IconButton extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func,
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
    counter: PropTypes.number,
    obfuscateCount: PropTypes.bool,
  };

  static defaultProps = {
    size: 18,
    active: false,
    disabled: false,
    animate: false,
    overlay: false,
    tabIndex: '0',
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  };

  handleClick = (e) =>  {
    e.preventDefault();

    if (!this.props.disabled) {
      this.props.onClick(e);
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
      inverted,
      overlay,
      pressed,
      tabIndex,
      title,
      text,
      emoji,
      counter,
      obfuscateCount,
    } = this.props;

    const classes = classNames(className, 'icon-button', {
      active,
      disabled,
      inverted,
      overlayed: overlay,
    });

    if (typeof counter !== 'undefined') {
      style.width = 'auto';
    }

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
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          tabIndex={tabIndex}
          disabled={disabled}
        >
          <div style={style}>
            {emoji
              ? <div className='icon-button__emoji' dangerouslySetInnerHTML={{ __html: emojify(emoji) }} aria-hidden='true' />
              : <Icon id={icon} fixedWidth aria-hidden='true' />}
          </div>
          {text && <span className='icon_button__text'>{text}</span>}
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
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
            tabIndex={tabIndex}
            disabled={disabled}
          >
            <div style={style}>
              {emoji
                ? <div className='icon-button__emoji' style={{ transform: `rotate(${rotate}deg)` }} dangerouslySetInnerHTML={{ __html: emojify(emoji) }} aria-hidden='true' />
                : <Icon id={icon} style={{ transform: `rotate(${rotate}deg)` }} fixedWidth aria-hidden='true' />}
              {typeof counter !== 'undefined' && <span className='icon-button__counter'><AnimatedNumber value={counter} obfuscate={obfuscateCount} /></span>}
            </div>
            {text && <span className='icon_button__text'>{text}</span>}
          </button>
        )}
      </Motion>
    );
  }

}

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Icon from './icon';

export default class Button extends React.PureComponent {

  static propTypes = {
    text: PropTypes.node,
    onClick: PropTypes.func,
    to: PropTypes.string,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    secondary: PropTypes.bool,
    size: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    size: 36,
  }

  handleClick = (e) => {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(e);
    }
  }

  setRef = (c) => {
    this.node = c;
  }

  focus() {
    this.node.focus();
  }

  render() {
    const style = {
      padding: `0 ${this.props.size / 2.25}px`,
      height: `${this.props.size}px`,
      lineHeight: `${this.props.size}px`,
      ...this.props.style,
    };

    const className = classNames('button', this.props.className, {
      'button-secondary': this.props.secondary,
      'button--block': this.props.block,
    });

    const btn = (
      <button
        className={className}
        disabled={this.props.disabled}
        onClick={this.handleClick}
        ref={this.setRef}
        style={style}
      >
        {this.props.icon && <Icon id={this.props.icon} />}
        {this.props.text || this.props.children}
      </button>
    );

    if (this.props.to) {
      return (
        <Link to={this.props.to} tabIndex={-1}>
          {btn}
        </Link>
      );
    } else {
      return btn;
    }
  }

}

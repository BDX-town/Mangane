import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export default class Column extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    transparent: PropTypes.bool,
    children: PropTypes.node,
    label: PropTypes.string,
  };

  setRef = c => {
    this.node = c;
  }

  render() {
    const { className, label, children, transparent, ...rest } = this.props;

    return (
      <div
        role='region'
        aria-label={label}
        className={classNames('column', className, { 'column--transparent': transparent })}
        {...rest}
        ref={this.setRef}
      >
        {children}
      </div>
    );
  }

}

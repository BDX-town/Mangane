import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Column extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
  };

  render() {
    const { className, label, children } = this.props;

    return (
      <div
        role='region'
        aria-label={label}
        className={classNames('column', className)}
      >
        {children}
      </div>
    );
  }

}

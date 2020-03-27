import React from 'react';
import PropTypes from 'prop-types';

export default class Column extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
  };

  render () {
    const { label, children } = this.props;

    return (
      <div role='region' aria-label={label} className='column'>
        {children}
      </div>
    );
  }

}

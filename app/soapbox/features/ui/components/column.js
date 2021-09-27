import React from 'react';
import ColumnHeader from './column_header';
import PropTypes from 'prop-types';

export default class Column extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    showBackBtn: PropTypes.bool,
  };

  static defaultProps = {
    showBackBtn: true,
  }

  render() {
    const { heading, icon, children, active, showBackBtn } = this.props;
    const columnHeaderId = heading && heading.replace(/ /g, '-');

    return (
      <div role='region' aria-labelledby={columnHeaderId} className='column'>
        {heading && <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} showBackBtn={showBackBtn} />}
        {children}
      </div>
    );
  }

}

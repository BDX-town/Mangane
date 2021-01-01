import React from 'react';
import ColumnHeader from './column_header';
import PropTypes from 'prop-types';
import ColumnBackButton from '../../../components/column_back_button';
import ColumnBackButtonSlim from '../../../components/column_back_button_slim';

export default class Column extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    backBtnSlim: PropTypes.bool,
  };

  render() {
    const { heading, icon, children, active, backBtnSlim } = this.props;
    const columnHeaderId = heading && heading.replace(/ /g, '-');
    const backBtn = backBtnSlim ? (<ColumnBackButtonSlim />) : (<ColumnBackButton />);

    return (
      <div role='region' aria-labelledby={columnHeaderId} className='column'>
        <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />
        {backBtn}
        {children}
      </div>
    );
  }

}

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
    back: PropTypes.string,
  };

  render() {
    const { heading, icon, children, active, backBtnSlim, back } = this.props;
    const columnHeaderId = heading && heading.replace(/ /g, '-');
    const backBtn = backBtnSlim ? (<ColumnBackButtonSlim to={back} />) : (<ColumnBackButton to={back} />);

    return (
      <div role='region' aria-labelledby={columnHeaderId} className='column'>
        {heading && <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />}
        {backBtn}
        {children}
      </div>
    );
  }

}

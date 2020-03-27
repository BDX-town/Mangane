import React from 'react';
import ColumnHeader from './column_header';
import PropTypes from 'prop-types';
import { isMobile } from '../../../is_mobile';
import ColumnBackButton from '../../../components/column_back_button';
import ColumnBackButtonSlim from '../../../components/column_back_button_slim';

export default class Column extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    hideHeadingOnMobile: PropTypes.bool,
    backBtnSlim: PropTypes.bool,
  };

  render () {
    const { heading, icon, children, active, hideHeadingOnMobile, backBtnSlim } = this.props;

    const showHeading = heading && (!hideHeadingOnMobile || (hideHeadingOnMobile && !isMobile(window.innerWidth)));

    const columnHeaderId = showHeading && heading.replace(/ /g, '-');
    const header = showHeading && (
      <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />
    );

    const backBtn = backBtnSlim ? (<ColumnBackButtonSlim/>) : (<ColumnBackButton/>);

    return (
      <div role='region' aria-labelledby={columnHeaderId} className='column'>
        {header}
        {backBtn}
        {children}
      </div>
    );
  }

}

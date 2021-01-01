import React from 'react';
import ColumnHeader from './column_header';
import PropTypes from 'prop-types';
import ColumnBackButton from '../../../components/column_back_button_slim';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';

// Yes, there are 3 types of columns at this point, but this one is better, I swear
export default class Column extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    menu: PropTypes.array,
  };

  render() {
    const { heading, icon, children, active, menu } = this.props;
    const columnHeaderId = heading && heading.replace(/ /g, '-');

    return (
      <div role='region' aria-labelledby={columnHeaderId} className='column column--better'>
        <div className='column__top'>
          {heading && <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />}
          {menu && (
            <div className='column__menu'>
              <DropdownMenu items={menu} icon='ellipsis-v' size={18} direction='right' />
            </div>
          )}
          <ColumnBackButton />
        </div>
        {children}
      </div>
    );
  }

}

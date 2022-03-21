import PropTypes from 'prop-types';
import React from 'react';

import { Column } from 'soapbox/components/ui';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';

import ColumnHeader from './column_header';

// Yes, there are 3 types of columns at this point, but this one is better, I swear
export default class BetterColumn extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    menu: PropTypes.array,
  };

  render() {
    const { heading, icon, children, active, menu, ...rest } = this.props;
    const columnHeaderId = heading && heading.replace(/ /g, '-');

    return (
      <Column aria-labelledby={columnHeaderId} className='column--better' {...rest}>
        <div className='column__top'>
          {heading && <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />}
          {menu && (
            <div className='column__menu'>
              <DropdownMenu items={menu} icon='ellipsis-v' size={18} direction='right' />
            </div>
          )}
        </div>
        {children}
      </Column>
    );
  }

}

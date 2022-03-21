import PropTypes from 'prop-types';
import React from 'react';

import Pullable from 'soapbox/components/pullable';
import { Column } from 'soapbox/components/ui';

import ColumnHeader from './column_header';

export default class UIColumn extends React.PureComponent {

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
    const { heading, icon, children, active, showBackBtn, ...rest } = this.props;
    const columnHeaderId = heading && heading.replace(/ /g, '-');

    return (
      <Column aria-labelledby={columnHeaderId} {...rest}>
        {heading && <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} showBackBtn={showBackBtn} />}
        <Pullable>
          {children}
        </Pullable>
      </Column>
    );
  }

}

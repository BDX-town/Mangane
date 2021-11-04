import React from 'react';
import ColumnHeader from './column_header';
import PropTypes from 'prop-types';
import Column from 'soapbox/components/column';
import Pullable from 'soapbox/components/pullable';

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

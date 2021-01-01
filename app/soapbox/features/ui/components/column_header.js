import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';

export default class ColumnHeader extends React.PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    type: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    columnHeaderId: PropTypes.string,
  };

  handleClick = () => {
    this.props.onClick();
  }

  render() {
    const { icon, type, active, columnHeaderId } = this.props;

    return (
      <h1 className={classNames('column-header', { active })} id={columnHeaderId || null}>
        <button onClick={this.handleClick}>
          {icon && <Icon id={icon} fixedWidth className='column-header__icon' />}
          {type}
        </button>
      </h1>
    );
  }

}

import PropTypes from 'prop-types';
import React from 'react';

export default class ComponentModal extends React.PureComponent {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    componentProps: PropTypes.object,
  }

  static defaultProps = {
    componentProps: {},
  }

  render() {
    const { onClose, component: Component, componentProps } = this.props;

    return (
      <div className='modal-root__modal component-modal'>
        <Component onClose={onClose} {...componentProps} />
      </div>
    );
  }

}

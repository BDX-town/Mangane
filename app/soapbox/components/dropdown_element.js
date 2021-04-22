import React from 'react';
import PropTypes from 'prop-types';
import Motion from '../features/ui/util/optional_motion';
import spring from 'react-motion/lib/spring';
import { supportsPassiveEvents } from 'detect-passive-events';

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

export default class DropdownElement extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    style: PropTypes.object,
    placement: PropTypes.string,
    arrowOffsetLeft: PropTypes.string,
    arrowOffsetTop: PropTypes.string,
    openedViaKeyboard: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
    placement: 'bottom',
  };

  state = {
    mounted: false,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  render() {
    const { children, style, placement, arrowOffsetLeft, arrowOffsetTop } = this.props;
    const { mounted } = this.state;
    return (
      <Motion defaultStyle={{ opacity: 0, scaleX: 1, scaleY: 1 }} style={{ opacity: spring(1, { damping: 35, stiffness: 400 }), scaleX: spring(1, { damping: 35, stiffness: 400 }), scaleY: spring(1, { damping: 35, stiffness: 400 }) }}>
        {({ opacity, scaleX, scaleY }) => (
          // It should not be transformed when mounting because the resulting
          // size will be used to determine the coordinate of the menu by
          // react-overlays
          <div className={`dropdown-menu ${placement}`} style={{ ...style, opacity: opacity, transform: mounted ? `scale(${scaleX}, ${scaleY})` : null }} ref={this.setRef}>
            <div className={`dropdown-menu__arrow ${placement}`} style={{ left: arrowOffsetLeft, top: arrowOffsetTop }} />
            {children}
          </div>
        )}
      </Motion>
    );
  }

}

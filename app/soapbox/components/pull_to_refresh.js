import React from 'react';
import PropTypes from 'prop-types';
import PTRComponent from 'react-simple-pull-to-refresh';

/**
 * PullToRefresh:
 * Wrapper around a third-party PTR component with Soapbox defaults.
 */
export default class PullToRefresh extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    onRefresh: PropTypes.func,
  }

  handleRefresh = () => {
    const { onRefresh } = this.props;

    if (onRefresh) {
      return onRefresh();
    } else {
      // If not provided, do nothing
      return new Promise(resolve => resolve());
    }
  }

  render() {
    const { children, onRefresh, ...rest } = this.props;

    return (
      <PTRComponent
        onRefresh={this.handleRefresh}
        pullingContent={null}
        // `undefined` will fallback to the default, while `null` will render nothing
        refreshingContent={onRefresh ? undefined : null}
        pullDownThreshold={130}
        maxPullDownDistance={130}
        resistance={2}
        {...rest}
      >
        {children}
      </PTRComponent>
    );
  }

}

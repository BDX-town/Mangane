import React from 'react';
import PropTypes from 'prop-types';
import PullToRefresh from 'react-simple-pull-to-refresh';

/**
 * Pullable:
 * Basic "pull to refresh" without the refresh.
 * Just visual feedback.
 */
export default class Pullable extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  handleRefresh = () => {
    return new Promise(resolve => resolve());
  }

  render() {
    const { children } = this.props;

    return (
      <PullToRefresh
        onRefresh={this.handleRefresh}
        pullingContent={null}
        refreshingContent={null}
      >
        {children}
      </PullToRefresh>
    );
  }

}

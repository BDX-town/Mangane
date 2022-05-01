import PropTypes from 'prop-types';
import React from 'react';

import PullToRefresh from './pull-to-refresh';

/**
 * Pullable:
 * Basic "pull to refresh" without the refresh.
 * Just visual feedback.
 */
export default class Pullable extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children } = this.props;

    return (
      <PullToRefresh
        pullingContent={null}
        refreshingContent={null}
      >
        {children}
      </PullToRefresh>
    );
  }

}

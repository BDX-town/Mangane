'use strict';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSettings } from 'soapbox/actions/settings';

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    pinnedHosts: settings.getIn(['remote_timeline', 'pinnedHosts']),
  };
};

class PinnedHostsPicker extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    pinnedHosts: ImmutablePropTypes.orderedSet,
    host: PropTypes.string,
  };

  render() {
    const { pinnedHosts, host: activeHost } = this.props;

    if (!pinnedHosts || pinnedHosts.isEmpty()) return null;

    return (
      <div className='pinned-hosts-picker'>
        {pinnedHosts.map(host => (
          <div className={classNames('pinned-host', { 'active': host === activeHost })} key={host}>
            <Link to={`/timeline/${host}`}>{host}</Link>
          </div>
        ))}
      </div>
    );
  }

}

export default connect(mapStateToProps)(PinnedHostsPicker);

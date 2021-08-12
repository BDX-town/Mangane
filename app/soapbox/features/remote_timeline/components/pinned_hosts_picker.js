'use strict';

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { getSettings } from 'soapbox/actions/settings';

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    pinnedHosts: settings.getIn(['remote_timeline', 'pinnedHosts']),
  };
};

class PinnedHostPicker extends React.PureComponent {

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
      <div>
        <div className='pinned-hosts-picker'>
          {pinnedHosts.map(host => (
            <div className={classNames('pinned-host', { 'active': host === activeHost })} key={host}>
              <Link to={`/timeline/${host}`}>{host}</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(PinnedHostPicker);

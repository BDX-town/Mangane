import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import Icon from 'soapbox/components/icon';
import { makeGetRemoteInstance } from 'soapbox/selectors';

import InstanceRestrictions from './instance_restrictions';

const getRemoteInstance = makeGetRemoteInstance();

const mapStateToProps = (state, ownProps) => {
  return {
    remoteInstance: getRemoteInstance(state, ownProps.host),
  };
};

export default @connect(mapStateToProps)
class RestrictedInstance extends ImmutablePureComponent {

  static propTypes = {
    host: PropTypes.string.isRequired,
  }

  state = {
    expanded: false,
  }

  toggleExpanded = e => {
    this.setState({ expanded: !this.state.expanded });
    e.preventDefault();
  }

  render() {
    const { remoteInstance } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classNames('restricted-instance', {
        'restricted-instance--reject': remoteInstance.getIn(['federation', 'reject']),
        'restricted-instance--expanded': expanded,
      })}
      >
        <a href='#' className='restricted-instance__header' onClick={this.toggleExpanded}>
          <div className='restricted-instance__icon'>
            <Icon src={expanded ? require('@tabler/icons/icons/caret-down.svg') : require('@tabler/icons/icons/caret-right.svg')} />
          </div>
          <div className='restricted-instance__host'>
            {remoteInstance.get('host')}
          </div>
        </a>
        <div className='restricted-instance__restrictions'>
          <InstanceRestrictions remoteInstance={remoteInstance} />
        </div>
      </div>
    );
  }

}

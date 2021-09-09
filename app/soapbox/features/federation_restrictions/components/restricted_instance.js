import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { makeGetRemoteInstance } from 'soapbox/selectors';
import classNames from 'classnames';
import InstanceRestrictions from './instance_restrictions';
import Icon from 'soapbox/components/icon';

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
            <Icon id={expanded ? 'caret-down' : 'caret-right'} />
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

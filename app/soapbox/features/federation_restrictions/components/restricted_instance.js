import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { makeGetRemoteInstance } from 'soapbox/selectors';
import classNames from 'classnames';

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

  render() {
    const { remoteInstance } = this.props;

    return (
      <div className={classNames('restricted-instance', { 'restricted-instance--reject': remoteInstance.getIn(['federation', 'reject']) })}>
        {remoteInstance.get('host')}
      </div>
    );
  }

}

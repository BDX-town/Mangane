'use strict';

import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { makeGetRemoteInstance } from 'soapbox/selectors';
import InstanceRestrictions from 'soapbox/features/federation_restrictions/components/instance_restrictions';

const getRemoteInstance = makeGetRemoteInstance();

const mapStateToProps = (state, { host }) => {
  return {
    instance: state.get('instance'),
    remoteInstance: getRemoteInstance(state, host),
  };
};

export default @connect(mapStateToProps, null, null, { forwardRef: true })
class InstanceInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    host: PropTypes.string.isRequired,
    instance: ImmutablePropTypes.map,
    remoteInstance: ImmutablePropTypes.map,
  };

  render() {
    const { remoteInstance } = this.props;

    return (
      <div className='wtf-panel instance-federation-panel'>
        <div className='wtf-panel-header'>
          <i role='img' alt='gavel' className='fa fa-gavel wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            <span><FormattedMessage id='remote_instance.federation_panel.heading' defaultMessage='Federation Restrictions' /></span>
          </span>
        </div>
        <div className='wtf-panel__content'>
          <InstanceRestrictions remoteInstance={remoteInstance} />
        </div>
      </div>
    );
  }

}

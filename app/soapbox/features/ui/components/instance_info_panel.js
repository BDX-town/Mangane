'use strict';

import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { makeGetRemoteInstance } from 'soapbox/selectors';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import { pinHost, unpinHost } from 'soapbox/actions/remote_timeline';
import { getSettings } from 'soapbox/actions/settings';

const getRemoteInstance = makeGetRemoteInstance();

const messages = defineMessages({
  pinHost: { id: 'remote_instance.pin_host', defaultMessage: 'Pin {host}' },
  unpinHost: { id: 'remote_instance.unpin_host', defaultMessage: 'Unpin {host}' },
});

const mapStateToProps = (state, { host }) => {
  const settings = getSettings(state);

  return {
    instance: state.get('instance'),
    remoteInstance: getRemoteInstance(state, host),
    pinned: settings.getIn(['remote_timeline', 'pinnedHosts']).includes(host),
  };
};

export default @connect(mapStateToProps, null, null, { forwardRef: true })
@injectIntl
class InstanceInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    host: PropTypes.string.isRequired,
    instance: ImmutablePropTypes.map,
    remoteInstance: ImmutablePropTypes.map,
    pinned: PropTypes.bool,
  };

  handlePinHost = e => {
    const { dispatch, host, pinned } = this.props;

    if (!pinned) {
      dispatch(pinHost(host));
    } else {
      dispatch(unpinHost(host));
    }
  }

  makeMenu = () => {
    const { intl, host, pinned } = this.props;

    return [{
      text: intl.formatMessage(pinned ? messages.unpinHost : messages.pinHost, { host }),
      action: this.handlePinHost,
    }];
  }

  render() {
    const { remoteInstance, pinned } = this.props;
    const menu = this.makeMenu();
    const icon = pinned ? 'thumb-tack' : 'globe-w';

    return (
      <div className='wtf-panel instance-federation-panel'>
        <div className='wtf-panel-header'>
          <i role='img' alt={icon} className={`fa fa-${icon} wtf-panel-header__icon`} />
          <span className='wtf-panel-header__label'>
            <span>{remoteInstance.get('host')}</span>
          </span>
          <div className='wtf-panel__menu'>
            <DropdownMenu items={menu} icon='ellipsis-v' size={18} direction='right' />
          </div>
        </div>
      </div>
    );
  }

}

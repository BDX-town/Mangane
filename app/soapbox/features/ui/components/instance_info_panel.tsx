'use strict';

import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { pinHost, unpinHost } from 'soapbox/actions/remote_timeline';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import { useAppSelector, useAppDispatch, useSettings } from 'soapbox/hooks';
import { makeGetRemoteInstance } from 'soapbox/selectors';

const getRemoteInstance = makeGetRemoteInstance();

const messages = defineMessages({
  pinHost: { id: 'remote_instance.pin_host', defaultMessage: 'Pin {host}' },
  unpinHost: { id: 'remote_instance.unpin_host', defaultMessage: 'Unpin {host}' },
});

interface IInstanceInfoPanel {
  /** Hostname (domain) of the remote instance, eg "gleasonator.com" */
  host: string,
}

/** Widget that displays information about a remote instance to users. */
const InstanceInfoPanel: React.FC<IInstanceInfoPanel> = ({ host }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const settings = useSettings();
  const remoteInstance: any = useAppSelector(state => getRemoteInstance(state, host));
  const pinned: boolean = (settings.getIn(['remote_timeline', 'pinnedHosts']) as any).includes(host);

  const handlePinHost: React.MouseEventHandler = () => {
    if (!pinned) {
      dispatch(pinHost(host));
    } else {
      dispatch(unpinHost(host));
    }
  };

  const makeMenu = () => {
    return [{
      text: intl.formatMessage(pinned ? messages.unpinHost : messages.pinHost, { host }),
      action: handlePinHost,
      icon: require(pinned ? '@tabler/icons/icons/pinned-off.svg' : '@tabler/icons/icons/pin.svg'),
    }];
  };

  const menu = makeMenu();
  const icon = pinned ? 'thumbtack' : 'globe-w';

  if (!remoteInstance) return null;

  return (
    <div className='wtf-panel instance-federation-panel'>
      <div className='wtf-panel-header'>
        <i role='img' className={`fa fa-${icon} wtf-panel-header__icon`} />
        <span className='wtf-panel-header__label'>
          <span>{remoteInstance.get('host')}</span>
        </span>
        <div className='wtf-panel__menu'>
          <DropdownMenu items={menu} src={require('@tabler/icons/icons/dots-vertical.svg')} />
        </div>
      </div>
    </div>
  );
};

export default InstanceInfoPanel;

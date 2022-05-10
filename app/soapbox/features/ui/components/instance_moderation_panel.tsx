'use strict';

import React from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

import { openModal } from 'soapbox/actions/modals';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import InstanceRestrictions from 'soapbox/features/federation_restrictions/components/instance_restrictions';
import { useAppSelector, useAppDispatch, useOwnAccount } from 'soapbox/hooks';
import { makeGetRemoteInstance } from 'soapbox/selectors';

const getRemoteInstance = makeGetRemoteInstance();

const messages = defineMessages({
  editFederation: { id: 'remote_instance.edit_federation', defaultMessage: 'Edit federation' },
});

interface IInstanceModerationPanel {
  /** Host (eg "gleasonator.com") of the remote instance to moderate. */
  host: string,
}

/** Widget for moderators to manage a remote instance. */
const InstanceModerationPanel: React.FC<IInstanceModerationPanel> = ({ host }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const account = useOwnAccount();
  const remoteInstance = useAppSelector(state => getRemoteInstance(state, host));

  const handleEditFederation = () => {
    dispatch(openModal('EDIT_FEDERATION', { host }));
  };

  const makeMenu = () => {
    return [{
      text: intl.formatMessage(messages.editFederation),
      action: handleEditFederation,
      icon: require('@tabler/icons/icons/edit.svg'),
    }];
  };

  const menu = makeMenu();

  return (
    <div className='wtf-panel instance-federation-panel'>
      <div className='wtf-panel-header'>
        <i role='img' className='fa fa-gavel wtf-panel-header__icon' />
        <span className='wtf-panel-header__label'>
          <span><FormattedMessage id='remote_instance.federation_panel.heading' defaultMessage='Federation Restrictions' /></span>
        </span>
        {account?.admin && (
          <div className='wtf-panel__menu'>
            <DropdownMenu items={menu} src={require('@tabler/icons/icons/dots-vertical.svg')} />
          </div>
        )}
      </div>
      <div className='wtf-panel__content'>
        <InstanceRestrictions remoteInstance={remoteInstance} />
      </div>
    </div>
  );
};

export default InstanceModerationPanel;

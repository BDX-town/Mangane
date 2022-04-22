'use strict';

import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import InstanceRestrictions from 'soapbox/features/federation_restrictions/components/instance_restrictions';
import { makeGetRemoteInstance } from 'soapbox/selectors';
import { isAdmin } from 'soapbox/utils/accounts';

const getRemoteInstance = makeGetRemoteInstance();

const messages = defineMessages({
  editFederation: { id: 'remote_instance.edit_federation', defaultMessage: 'Edit federation' },
});

const mapStateToProps = (state, { host }) => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);

  return {
    instance: state.get('instance'),
    remoteInstance: getRemoteInstance(state, host),
    isAdmin: isAdmin(account),
  };
};

export default @connect(mapStateToProps, null, null, { forwardRef: true })
@injectIntl
class InstanceModerationPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    host: PropTypes.string.isRequired,
    instance: ImmutablePropTypes.map,
    remoteInstance: ImmutablePropTypes.map,
    isAdmin: PropTypes.bool,
  };

  handleEditFederation = e => {
    const { dispatch, host } = this.props;
    dispatch(openModal('EDIT_FEDERATION', { host }));
  }

  makeMenu = () => {
    const { intl } = this.props;

    return [{
      text: intl.formatMessage(messages.editFederation),
      action: this.handleEditFederation,
      icon: require('@tabler/icons/icons/edit.svg'),
    }];
  }

  render() {
    const { remoteInstance, isAdmin } = this.props;
    const menu = this.makeMenu();

    return (
      <div className='wtf-panel instance-federation-panel'>
        <div className='wtf-panel-header'>
          <i role='img' alt='gavel' className='fa fa-gavel wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            <span><FormattedMessage id='remote_instance.federation_panel.heading' defaultMessage='Federation Restrictions' /></span>
          </span>
          {isAdmin && <div className='wtf-panel__menu'>
            <DropdownMenu items={menu} src={require('@tabler/icons/icons/dots-vertical.svg')} direction='right' />
          </div>}
        </div>
        <div className='wtf-panel__content'>
          <InstanceRestrictions remoteInstance={remoteInstance} />
        </div>
      </div>
    );
  }

}

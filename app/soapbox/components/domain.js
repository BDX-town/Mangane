import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';

import IconButton from './icon_button';

const messages = defineMessages({
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
});

export default @injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    domain: PropTypes.string,
    onUnblockDomain: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleDomainUnblock = () => {
    this.props.onUnblockDomain(this.props.domain);
  }

  render() {
    const { domain, intl } = this.props;

    return (
      <div className='domain'>
        <div className='domain__wrapper'>
          <span className='domain__domain-name'>
            <strong>{domain}</strong>
          </span>

          <div className='domain__buttons'>
            <IconButton active src={require('@tabler/icons/icons/lock-open.svg')} title={intl.formatMessage(messages.unblockDomain, { domain })} onClick={this.handleDomainUnblock} />
          </div>
        </div>
      </div>
    );
  }

}

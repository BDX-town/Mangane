import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Column from '../ui/components/column';
import SiteWallet from './components/site_wallet';

const messages = defineMessages({
  heading: { id: 'column.crypto_donate', defaultMessage: 'Donate Cryptocurrency' },
});

export default
@injectIntl
class CryptoDonate extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.props;

    return (
      <Column icon='bitcoin' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='crypto-donate'>
          <SiteWallet />
        </div>
      </Column>
    );
  }

}

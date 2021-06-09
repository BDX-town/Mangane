import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Column from '../ui/components/column';
import CoinList from './coin_list';

const messages = defineMessages({
  heading: { id: 'column.cryptocoin', defaultMessage: 'Donate Cryptocurrency' },
});

export default
@injectIntl
class Cryptocoin extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.props;

    return (
      <Column icon='bitcoin' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='cryptocoin'>
          <CoinList />
        </div>
      </Column>
    );
  }

}

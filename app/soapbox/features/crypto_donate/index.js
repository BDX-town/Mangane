import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Column from '../ui/components/column';
import Accordion from 'soapbox/features/ui/components/accordion';
import SiteWallet from './components/site_wallet';

const messages = defineMessages({
  heading: { id: 'column.crypto_donate', defaultMessage: 'Donate Cryptocurrency' },
});

const mapStateToProps = state => ({
  siteTitle: state.getIn(['instance', 'title']),
});

export default @connect(mapStateToProps)
@injectIntl
class CryptoDonate extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  state = {
    explanationBoxExpanded: true,
  }

  toggleExplanationBox = (setting) => {
    this.setState({ explanationBoxExpanded: setting });
  }

  render() {
    const { intl, siteTitle } = this.props;
    const { explanationBoxExpanded } = this.state;

    return (
      <Column icon='bitcoin' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='crypto-donate'>
          <div className='explanation-box'>
            <Accordion
              headline={<FormattedMessage id='crypto_donate.explanation_box.title' defaultMessage='Sending cryptocurrency donations' />}
              expanded={explanationBoxExpanded}
              onToggle={this.toggleExplanationBox}
            >
              <FormattedMessage
                id='crypto_donate.explanation_box.message'
                defaultMessage='{siteTitle} accepts cryptocurrency donations. You may send a donation to any of the addresses below. Thank you for your support!'
                values={{ siteTitle }}
              />
            </Accordion>

          </div>
          <SiteWallet />
        </div>
      </Column>
    );
  }

}

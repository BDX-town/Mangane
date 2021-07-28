import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Column from '../ui/components/column';
import RestrictedInstance from './components/restricted_instance';
import Accordion from 'soapbox/features/ui/components/accordion';
import ScrollableList from 'soapbox/components/scrollable_list';
import { federationRestrictionsDisclosed } from 'soapbox/utils/state';
import { makeGetHosts } from 'soapbox/selectors';

const messages = defineMessages({
  heading: { id: 'column.federation_restrictions', defaultMessage: 'Federation Restrictions' },
  boxTitle: { id: 'federation_restrictions.explanation_box.title', defaultMessage: 'Instance-specific policies' },
  boxMessage: { id: 'federation_restrictions.explanation_box.message', defaultMessage: 'Normally servers on the Fediverse can communicate freely. {siteTitle} has imposed restrictions on the following servers.' },
  emptyMessage: { id: 'federation_restrictions.empty_message', defaultMessage: '{siteTitle} has not restricted any instances.' },
  notDisclosed: { id: 'federation_restrictions.not_disclosed_message', defaultMessage: '{siteTitle} does not disclose federation restrictions through the API.' },
});

const getHosts = makeGetHosts();

const mapStateToProps = state => ({
  siteTitle: state.getIn(['instance', 'title']),
  hosts: getHosts(state),
  disclosed: federationRestrictionsDisclosed(state),
});

export default @connect(mapStateToProps)
@injectIntl
class FederationRestrictions extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    disclosed: PropTypes.bool,
  };

  state = {
    explanationBoxExpanded: true,
  }

  toggleExplanationBox = setting => {
    this.setState({ explanationBoxExpanded: setting });
  }

  render() {
    const { intl, hosts, siteTitle, disclosed } = this.props;
    const { explanationBoxExpanded } = this.state;

    const emptyMessage = disclosed ? messages.emptyMessage : messages.notDisclosed;

    return (
      <Column icon='gavel' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='explanation-box'>
          <Accordion
            headline={intl.formatMessage(messages.boxTitle)}
            expanded={explanationBoxExpanded}
            onToggle={this.toggleExplanationBox}
          >
            {intl.formatMessage(messages.boxMessage, { siteTitle })}
          </Accordion>
        </div>

        <div className='federation-restrictions'>
          <ScrollableList emptyMessage={intl.formatMessage(emptyMessage, { siteTitle })}>
            {hosts.map(host => <RestrictedInstance key={host} host={host} />)}
          </ScrollableList>
        </div>
      </Column>
    );
  }

}

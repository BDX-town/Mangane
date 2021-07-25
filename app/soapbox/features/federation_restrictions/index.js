import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Column from '../ui/components/column';
import { createSelector } from 'reselect';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';
import RestrictedInstance from './components/restricted_instance';
import Accordion from 'soapbox/features/ui/components/accordion';

const getHosts = createSelector([
  state => state.getIn(['instance', 'pleroma', 'metadata', 'federation', 'mrf_simple'], ImmutableMap()),
], (simplePolicy) => {
  return simplePolicy
    .deleteAll(['accept', 'reject_deletes', 'report_removal'])
    .reduce((acc, hosts) => acc.union(hosts), ImmutableOrderedSet())
    .sort();
});

const messages = defineMessages({
  heading: { id: 'column.federation_restrictions', defaultMessage: 'Federation Restrictions' },
  boxTitle: { id: 'federation_restrictions.explanation_box.title', defaultMessage: 'Instance-specific policies' },
  boxMessage: { id: 'federation_restrictions.explanation_box.message', defaultMessage: 'Normally servers on the Fediverse can communicate freely. {siteTitle} has imposed restrictions on the following servers.' },
});

const mapStateToProps = state => ({
  siteTitle: state.getIn(['instance', 'title']),
  hosts: getHosts(state),
});

export default @connect(mapStateToProps)
@injectIntl
class FederationRestrictions extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  state = {
    explanationBoxExpanded: true,
  }

  toggleExplanationBox = setting => {
    this.setState({ explanationBoxExpanded: setting });
  }

  render() {
    const { intl, hosts, siteTitle } = this.props;
    const { explanationBoxExpanded } = this.state;

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
          {hosts.map(host => <RestrictedInstance key={host} host={host} />)}
        </div>
      </Column>
    );
  }

}

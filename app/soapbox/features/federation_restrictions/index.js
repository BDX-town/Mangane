import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Column from '../ui/components/column';
import { createSelector } from 'reselect';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

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

  render() {
    const { intl, hosts } = this.props;

    return (
      <Column icon='gavel' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='federation-restrictions'>
          <ul>
            {hosts.map(host => <li key={host}>{host}</li>)}
          </ul>
        </div>
      </Column>
    );
  }

}

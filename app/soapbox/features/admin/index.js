import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSubscribersCsv, getUnsubscribersCsv, getCombinedCsv } from 'soapbox/actions/email_list';
import { Text } from 'soapbox/components/ui';
import sourceCode from 'soapbox/utils/code';
import { parseVersion } from 'soapbox/utils/features';
import { getFeatures } from 'soapbox/utils/features';
import { isNumber } from 'soapbox/utils/numbers';

import Column from '../ui/components/column';

import RegistrationModePicker from './components/registration_mode_picker';

// https://stackoverflow.com/a/53230807
const download = (response, filename) => {
  const url = URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const messages = defineMessages({
  heading: { id: 'column.admin.dashboard', defaultMessage: 'Dashboard' },
});

const mapStateToProps = (state, props) => {
  const me = state.get('me');

  return {
    instance: state.get('instance'),
    supportsEmailList: getFeatures(state.get('instance')).emailList,
    account: state.getIn(['accounts', me]),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Dashboard extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    instance: ImmutablePropTypes.map.isRequired,
    supportsEmailList: PropTypes.bool,
    account: ImmutablePropTypes.record,
  };

  handleSubscribersClick = e => {
    this.props.dispatch(getSubscribersCsv()).then((response) => {
      download(response, 'subscribers.csv');
    }).catch(() => {});
    e.preventDefault();
  }

  handleUnsubscribersClick = e => {
    this.props.dispatch(getUnsubscribersCsv()).then((response) => {
      download(response, 'unsubscribers.csv');
    }).catch(() => {});
    e.preventDefault();
  }

  handleCombinedClick = e => {
    this.props.dispatch(getCombinedCsv()).then((response) => {
      download(response, 'combined.csv');
    }).catch(() => {});
    e.preventDefault();
  }

  render() {
    const { intl, instance, supportsEmailList, account } = this.props;
    const v = parseVersion(instance.get('version'));
    const userCount = instance.getIn(['stats', 'user_count']);
    const mau = instance.getIn(['pleroma', 'stats', 'mau']);
    const retention = (userCount && mau) ? Math.round(mau / userCount * 100) : null;

    if (!account) return null;

    return (
      <Column icon='tachometer-alt' label={intl.formatMessage(messages.heading)}>
        <div className='dashcounters'>
          {mau && <div className='dashcounter'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={mau} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.mau_label' defaultMessage='monthly active users' />
            </Text>
          </div>}
          <Link className='dashcounter' to='/admin/users'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={userCount} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.user_count_label' defaultMessage='total users' />
            </Text>
          </Link>
          {isNumber(retention) && (
            <div className='dashcounter'>
              <Text align='center' size='2xl' weight='medium'>
                {retention}%
              </Text>
              <Text align='center'>
                <FormattedMessage id='admin.dashcounters.retention_label' defaultMessage='user retention' />
              </Text>
            </div>
          )}
          <Link className='dashcounter' to='/timeline/local'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={instance.getIn(['stats', 'status_count'])} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.status_count_label' defaultMessage='posts' />
            </Text>
          </Link>
          <div className='dashcounter'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={instance.getIn(['stats', 'domain_count'])} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.domain_count_label' defaultMessage='peers' />
            </Text>
          </div>
        </div>
        {account.admin && <RegistrationModePicker />}
        <div className='dashwidgets'>
          <div className='dashwidget'>
            <h4><FormattedMessage id='admin.dashwidgets.software_header' defaultMessage='Software' /></h4>
            <ul>
              <li>{sourceCode.displayName} <span className='pull-right'>{sourceCode.version}</span></li>
              <li>{v.software} <span className='pull-right'>{v.version}</span></li>
            </ul>
          </div>
          {supportsEmailList && account.admin && <div className='dashwidget'>
            <h4><FormattedMessage id='admin.dashwidgets.email_list_header' defaultMessage='Email list' /></h4>
            <ul>
              <li><a href='#' onClick={this.handleSubscribersClick} target='_blank'>subscribers.csv</a></li>
              <li><a href='#' onClick={this.handleUnsubscribersClick} target='_blank'>unsubscribers.csv</a></li>
              <li><a href='#' onClick={this.handleCombinedClick} target='_blank'>combined.csv</a></li>
            </ul>
          </div>}
        </div>
      </Column>
    );
  }

}

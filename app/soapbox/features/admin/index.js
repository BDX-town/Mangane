import React from 'react';
import { defineMessages, injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import RegistrationModePicker from './components/registration_mode_picker';
import { parseVersion } from 'soapbox/utils/features';
import sourceCode from 'soapbox/utils/code';
import { getSubscribersCsv, getUnsubscribersCsv, getCombinedCsv } from 'soapbox/actions/email_list';
import { getFeatures } from 'soapbox/utils/features';
import { isAdmin } from 'soapbox/utils/accounts';

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
    account: ImmutablePropTypes.map,
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
      <Column icon='tachometer' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='dashcounters'>
          {mau && <div className='dashcounter'>
            <div>
              <div className='dashcounter__num'>
                <FormattedNumber value={mau} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.mau_label' defaultMessage='monthly active users' />
              </div>
            </div>
          </div>}
          <div className='dashcounter'>
            <Link to='/admin/users'>
              <div className='dashcounter__num'>
                <FormattedNumber value={userCount} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.user_count_label' defaultMessage='total users' />
              </div>
            </Link>
          </div>
          {retention && <div className='dashcounter'>
            <div>
              <div className='dashcounter__num'>
                {retention}%
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.retention_label' defaultMessage='user retention' />
              </div>
            </div>
          </div>}
          <div className='dashcounter'>
            <Link to='/timeline/local'>
              <div className='dashcounter__num'>
                <FormattedNumber value={instance.getIn(['stats', 'status_count'])} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.status_count_label' defaultMessage='posts' />
              </div>
            </Link>
          </div>
          <div className='dashcounter'>
            <div>
              <div className='dashcounter__num'>
                <FormattedNumber value={instance.getIn(['stats', 'domain_count'])} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.domain_count_label' defaultMessage='peers' />
              </div>
            </div>
          </div>
        </div>
        {isAdmin(account) && <RegistrationModePicker />}
        <div className='dashwidgets'>
          <div className='dashwidget'>
            <h4><FormattedMessage id='admin.dashwidgets.software_header' defaultMessage='Software' /></h4>
            <ul>
              <li>{sourceCode.displayName} <span className='pull-right'>{sourceCode.version}</span></li>
              <li>{v.software} <span className='pull-right'>{v.version}</span></li>
            </ul>
          </div>
          {supportsEmailList && isAdmin(account) && <div className='dashwidget'>
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

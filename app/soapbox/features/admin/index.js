import React from 'react';
import { defineMessages, injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import RegistrationModePicker from './components/registration_mode_picker';
import { parseVersion } from 'soapbox/utils/features';

const messages = defineMessages({
  heading: { id: 'column.admin.dashboard', defaultMessage: 'Dashboard' },
});

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  openReportCount: state.getIn(['admin', 'open_report_count']),
});

export default @connect(mapStateToProps)
@injectIntl
class Dashboard extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    instance: ImmutablePropTypes.map.isRequired,
    openReportCount: PropTypes.number,
  };

  render() {
    const { intl, instance } = this.props;
    const v = parseVersion(instance.get('version'));

    return (
      <Column icon='tachometer' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='dashcounters'>
          <div className='dashcounter'>
            <a href='/pleroma/admin/#/users/index' target='_blank'>
              <div className='dashcounter__num'>
                <FormattedNumber value={instance.getIn(['stats', 'user_count'])} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.user_count_label' defaultMessage='users' />
              </div>
            </a>
          </div>
          <div className='dashcounter'>
            <a href='/pleroma/admin/#/statuses/index' target='_blank'>
              <div className='dashcounter__num'>
                <FormattedNumber value={instance.getIn(['stats', 'status_count'])} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.status_count_label' defaultMessage='posts' />
              </div>
            </a>
          </div>
          <div className='dashcounter'>
            <a href='/pleroma/admin/#/reports/index' target='_blank'>
              <div className='dashcounter__num'>
                <FormattedNumber value={this.props.openReportCount} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.open_report_count_label' defaultMessage='open reports' />
              </div>
            </a>
          </div>
        </div>
        <RegistrationModePicker />
        <div className='dashwidgets'>
          <div class='dashwidget'>
            <h4><FormattedMessage id='admin.dashwidgets.software_header' defaultMessage='Software' /></h4>
            <ul>
              <li>Soapbox FE <span class='pull-right'>1.1.0</span></li>
              <li>{v.software} <span class='pull-right'>{v.version}</span></li>
            </ul>
          </div>
        </div>
      </Column>
    );
  }

}

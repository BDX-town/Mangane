import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Avatar from 'soapbox/components/avatar';
import Button from 'soapbox/components/button';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import { deactivateUsers, closeReports } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';

const messages = defineMessages({
  deactivateUser: { id: 'admin.reports.actions.deactivate_user', defaultMessage: 'Deactivate {acct}' },
  userDeactivated: { id: 'admin.reports.user_deactivated_message', defaultMessage: '{acct} was deactivated' },
  reportClosed: { id: 'admin.reports.report_closed_message', defaultMessage: 'Report on {acct} was closed' },
});

export default @connect()
@injectIntl
class Report extends ImmutablePureComponent {

  static propTypes = {
    report: ImmutablePropTypes.map.isRequired,
  };

  makeMenu = () => {
    const { intl, report } = this.props;

    return [{
      text: intl.formatMessage(messages.deactivateUser, { acct: `@${report.getIn(['account', 'acct'])}` }),
      action: this.handleDeactivateUser,
    }];
  }

  handleCloseReport = () => {
    const { intl, dispatch, report } = this.props;
    const nickname = report.getIn(['account', 'acct']);
    dispatch(closeReports([report.get('id')])).then(() => {
      const message = intl.formatMessage(messages.reportClosed, { acct: `@${nickname}` });
      dispatch(snackbar.success(message));
    }).catch(() => {});
  }

  handleDeactivateUser = () => {
    const { intl, dispatch, report } = this.props;
    const nickname = report.getIn(['account', 'acct']);
    dispatch(deactivateUsers([nickname])).then(() => {
      const message = intl.formatMessage(messages.userDeactivated, { acct: `@${nickname}` });
      dispatch(snackbar.success(message));
    }).catch(() => {});
  }

  render() {
    const { report } = this.props;
    const menu = this.makeMenu();

    return (
      <div className='admin-report' key={report.get('id')}>
        <div className='admin-report__avatar'>
          <Avatar account={report.get('account')} size={32} />
        </div>
        <div className='admin-report__content'>
          <h4 className='admin-report__title'>
            <FormattedMessage
              id='admin.reports.report_title'
              defaultMessage='Report on {acct}'
              values={{ acct:  `@${report.getIn(['account', 'acct'])}` }}
            />
          </h4>
          <div class='admin-report__quote'>
            <blockquote className='md'>{report.get('content')}</blockquote>
            <span className='byline'>&mdash; @{report.getIn(['actor', 'acct'])}</span>
          </div>
        </div>
        <div className='admin-report__actions'>
          <Button className='button-alternative' size={30} onClick={this.handleCloseReport}>
            <FormattedMessage id='admin.reports.actions.close' defaultMessage='Close' />
          </Button>
          <DropdownMenu items={menu} icon='ellipsis-v' size={24} direction='right' />
        </div>
      </div>
    );
  }

}

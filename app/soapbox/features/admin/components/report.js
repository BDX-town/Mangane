import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { closeReports } from 'soapbox/actions/admin';
import { deactivateUserModal, deleteUserModal } from 'soapbox/actions/moderation';
import snackbar from 'soapbox/actions/snackbar';
import Avatar from 'soapbox/components/avatar';
import { Button } from 'soapbox/components/ui';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import Accordion from 'soapbox/features/ui/components/accordion';

import ReportStatus from './report_status';

const messages = defineMessages({
  reportClosed: { id: 'admin.reports.report_closed_message', defaultMessage: 'Report on @{name} was closed' },
  deactivateUser: { id: 'admin.users.actions.deactivate_user', defaultMessage: 'Deactivate @{name}' },
  deleteUser: { id: 'admin.users.actions.delete_user', defaultMessage: 'Delete @{name}' },
});

export default @connect()
@injectIntl
class Report extends ImmutablePureComponent {

  static propTypes = {
    report: ImmutablePropTypes.map.isRequired,
  };

  state = {
    accordionExpanded: false,
  };

  makeMenu = () => {
    const { intl, report } = this.props;

    return [{
      text: intl.formatMessage(messages.deactivateUser, { name: report.getIn(['account', 'username']) }),
      action: this.handleDeactivateUser,
      icon: require('@tabler/icons/icons/user-off.svg'),
    }, {
      text: intl.formatMessage(messages.deleteUser, { name: report.getIn(['account', 'username']) }),
      action: this.handleDeleteUser,
      icon: require('@tabler/icons/icons/user-minus.svg'),
    }];
  }

  handleCloseReport = () => {
    const { intl, dispatch, report } = this.props;
    dispatch(closeReports([report.get('id')])).then(() => {
      const message = intl.formatMessage(messages.reportClosed, { name: report.getIn(['account', 'username']) });
      dispatch(snackbar.success(message));
    }).catch(() => {});
  }

  handleDeactivateUser = () => {
    const { intl, dispatch, report } = this.props;
    const accountId = report.getIn(['account', 'id']);
    dispatch(deactivateUserModal(intl, accountId, () => this.handleCloseReport()));
  }

  handleDeleteUser = () => {
    const { intl, dispatch, report } = this.props;
    const accountId = report.getIn(['account', 'id']);
    dispatch(deleteUserModal(intl, accountId, () => this.handleCloseReport()));
  }

  handleAccordionToggle = setting => {
    this.setState({ accordionExpanded: setting });
  }

  render() {
    const { report } = this.props;
    const { accordionExpanded } = this.state;
    const menu = this.makeMenu();
    const statuses = report.get('statuses');
    const statusCount = statuses.count();
    const acct = report.getIn(['account', 'acct']);
    const reporterAcct = report.getIn(['actor', 'acct']);

    return (
      <div className='admin-report' key={report.get('id')}>
        <div className='admin-report__avatar'>
          <Link to={`/@${acct}`} title={acct}>
            <Avatar account={report.get('account')} size={32} />
          </Link>
        </div>
        <div className='admin-report__content'>
          <h4 className='admin-report__title'>
            <FormattedMessage
              id='admin.reports.report_title'
              defaultMessage='Report on {acct}'
              values={{ acct: <Link to={`/@${acct}`} title={acct}>@{acct}</Link> }}
            />
          </h4>
          <div className='admin-report__statuses'>
            {statusCount > 0 && (
              <Accordion
                headline={`Reported posts (${statusCount})`}
                expanded={accordionExpanded}
                onToggle={this.handleAccordionToggle}
              >
                {statuses.map(status => <ReportStatus report={report} status={status} key={status.get('id')} />)}
              </Accordion>
            )}
          </div>
          <div className='admin-report__quote'>
            {report.get('content', '').length > 0 &&
              <blockquote className='md' dangerouslySetInnerHTML={{ __html: report.get('content') }} />
            }
            <span className='byline'>&mdash; <Link to={`/@${reporterAcct}`} title={reporterAcct}>@{reporterAcct}</Link></span>
          </div>
        </div>
        <div className='admin-report__actions'>
          <Button className='button-alternative' size={30} onClick={this.handleCloseReport}>
            <FormattedMessage id='admin.reports.actions.close' defaultMessage='Close' />
          </Button>
          <DropdownMenu className='admin-report__dropdown' items={menu} src={require('@tabler/icons/icons/dots-vertical.svg')} direction='right' />
        </div>
      </div>
    );
  }

}

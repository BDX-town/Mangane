import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Avatar from 'soapbox/components/avatar';
import Button from 'soapbox/components/button';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import Accordion from 'soapbox/features/ui/components/accordion';
import ReportStatus from './report_status';
import { closeReports, deactivateUsers, deleteUsers } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';
import { openModal } from 'soapbox/actions/modal';

const messages = defineMessages({
  reportClosed: { id: 'admin.reports.report_closed_message', defaultMessage: 'Report on {acct} was closed' },
  deactivateUser: { id: 'admin.reports.actions.deactivate_user', defaultMessage: 'Deactivate {acct}' },
  deactivateUserPrompt: { id: 'confirmations.admin.deactivate_user.message', defaultMessage: 'You are about to deactivate {acct}. Deactivating a user is a reversible action.' },
  deactivateUserConfirm: { id: 'confirmations.admin.deactivate_user.confirm', defaultMessage: 'Deactivate {acct}' },
  userDeactivated: { id: 'admin.reports.user_deactivated_message', defaultMessage: '{acct} was deactivated' },
  deleteUser: { id: 'admin.reports.actions.delete_user', defaultMessage: 'Delete {acct}' },
  deleteUserPrompt: { id: 'confirmations.admin.delete_user.message', defaultMessage: 'You are about to delete {acct}. THIS IS A DESTRUCTIVE ACTION THAT CANNOT BE UNDONE.' },
  deleteUserConfirm: { id: 'confirmations.admin.delete_user.confirm', defaultMessage: 'Delete {acct}' },
  userDeleted: { id: 'admin.reports.user_deleted_message', defaultMessage: '{acct} was deleted' },
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
      text: intl.formatMessage(messages.deactivateUser, { acct: `@${report.getIn(['account', 'acct'])}` }),
      action: this.handleDeactivateUser,
    }, {
      text: intl.formatMessage(messages.deleteUser, { acct: `@${report.getIn(['account', 'acct'])}` }),
      action: this.handleDeleteUser,
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
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deactivateUserPrompt, { acct: `@${nickname}` }),
      confirm: intl.formatMessage(messages.deactivateUserConfirm, { acct: `@${nickname}` }),
      onConfirm: () => {
        dispatch(deactivateUsers([nickname])).then(() => {
          const message = intl.formatMessage(messages.userDeactivated, { acct: `@${nickname}` });
          dispatch(snackbar.success(message));
        }).catch(() => {});
        this.handleCloseReport();
      },
    }));
  }

  handleDeleteUser = () => {
    const { intl, dispatch, report } = this.props;
    const nickname = report.getIn(['account', 'acct']);
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deleteUserPrompt, { acct: `@${nickname}` }),
      confirm: intl.formatMessage(messages.deleteUserConfirm, { acct: `@${nickname}` }),
      onConfirm: () => {
        dispatch(deleteUsers([nickname])).then(() => {
          const message = intl.formatMessage(messages.userDeleted, { acct: `@${nickname}` });
          dispatch(snackbar.success(message));
        }).catch(() => {});
        this.handleCloseReport();
      },
    }));
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
          <DropdownMenu items={menu} icon='ellipsis-v' size={24} direction='right' />
        </div>
      </div>
    );
  }

}

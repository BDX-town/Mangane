import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import StatusContent from 'soapbox/components/status_content';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import { deleteStatus } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';
import { openModal } from 'soapbox/actions/modal';

const messages = defineMessages({
  deleteStatus: { id: 'admin.reports.actions.delete_status', defaultMessage: 'Delete post' },
  deleteStatusPrompt: { id: 'confirmations.admin.delete_status.message', defaultMessage: 'You are about to delete a post by {acct}. This action cannot be undone.' },
  deleteStatusConfirm: { id: 'confirmations.admin.delete_status.confirm', defaultMessage: 'Delete post' },
  statusDeleted: { id: 'admin.reports.status_deleted_message', defaultMessage: 'Post by {acct} was deleted' },
});

export default @connect()
@injectIntl
class ReportStatus extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    report: ImmutablePropTypes.map,
  };

  makeMenu = () => {
    const { intl, status } = this.props;

    return [{
      text: intl.formatMessage(messages.deleteStatus, { acct: `@${status.getIn(['account', 'acct'])}` }),
      action: this.handleDeleteStatus,
    }];
  }

  handleDeleteStatus = () => {
    const { intl, dispatch, status } = this.props;
    const nickname = status.getIn(['account', 'acct']);
    const statusId = status.get('id');
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deleteStatusPrompt, { acct: `@${nickname}` }),
      confirm: intl.formatMessage(messages.deleteStatusConfirm),
      onConfirm: () => {
        dispatch(deleteStatus(statusId)).then(() => {
          const message = intl.formatMessage(messages.statusDeleted, { acct: `@${nickname}` });
          dispatch(snackbar.success(message));
        }).catch(() => {});
        this.handleCloseReport();
      },
    }));
  }

  render() {
    const { status } = this.props;
    const menu = this.makeMenu();

    return (
      <div className='admin-report__status'>
        <StatusContent status={status} />
        <div className='admin-report__status-actions'>
          <DropdownMenu items={menu} icon='ellipsis-v' size={18} direction='right' />
        </div>
      </div>
    );
  }

}

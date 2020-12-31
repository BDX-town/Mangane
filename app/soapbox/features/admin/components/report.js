import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Avatar from 'soapbox/components/avatar';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import { deactivateUsers } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';

const messages = defineMessages({
  deactivateUser: { id: 'admin.reports.actions.deactivate_user', defaultMessage: 'Deactivate {acct}' },
  deactivated: { id: 'admin.reports.deactivated_message', defaultMessage: '{acct} was deactivated' },
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

  handleDeactivateUser = () => {
    const { intl, dispatch, report } = this.props;
    const nickname = report.getIn(['account', 'acct']);
    dispatch(deactivateUsers([nickname])).then(() => {
      const message = intl.formatMessage(messages.deactivated, { acct: nickname });
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
          <DropdownMenu items={menu} icon='ellipsis-v' size={24} direction='right' />
        </div>
      </div>
    );
  }

}

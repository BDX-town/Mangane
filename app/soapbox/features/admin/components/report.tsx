import React, { useState } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { closeReports } from 'soapbox/actions/admin';
import { deactivateUserModal, deleteUserModal } from 'soapbox/actions/moderation';
import snackbar from 'soapbox/actions/snackbar';
import Avatar from 'soapbox/components/avatar';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import { Button, HStack } from 'soapbox/components/ui';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import Accordion from 'soapbox/features/ui/components/accordion';
import { useAppDispatch } from 'soapbox/hooks';

import ReportStatus from './report_status';

import type { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import type { Status } from 'soapbox/types/entities';

const messages = defineMessages({
  reportClosed: { id: 'admin.reports.report_closed_message', defaultMessage: 'Report on @{name} was closed' },
  deactivateUser: { id: 'admin.users.actions.deactivate_user', defaultMessage: 'Deactivate @{name}' },
  deleteUser: { id: 'admin.users.actions.delete_user', defaultMessage: 'Delete @{name}' },
});

interface IReport {
  report: ImmutableMap<string, any>;
}

const Report: React.FC<IReport> = ({ report }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [accordionExpanded, setAccordionExpanded] = useState(false);

  const makeMenu = () => {
    return [{
      text: intl.formatMessage(messages.deactivateUser, { name: report.getIn(['account', 'username']) as string }),
      action: handleDeactivateUser,
      icon: require('@tabler/icons/icons/user-off.svg'),
    }, {
      text: intl.formatMessage(messages.deleteUser, { name: report.getIn(['account', 'username']) as string }),
      action: handleDeleteUser,
      icon: require('@tabler/icons/icons/user-minus.svg'),
    }];
  };

  const handleCloseReport = () => {
    dispatch(closeReports([report.get('id')])).then(() => {
      const message = intl.formatMessage(messages.reportClosed, { name: report.getIn(['account', 'username']) as string });
      dispatch(snackbar.success(message));
    }).catch(() => {});
  };

  const handleDeactivateUser = () => {
    const accountId = report.getIn(['account', 'id']);
    dispatch(deactivateUserModal(intl, accountId, () => handleCloseReport()));
  };

  const handleDeleteUser = () => {
    const accountId = report.getIn(['account', 'id']) as string;
    dispatch(deleteUserModal(intl, accountId, () => handleCloseReport()));
  };

  const handleAccordionToggle = (setting: boolean) => {
    setAccordionExpanded(setting);
  };

  const menu = makeMenu();
  const statuses = report.get('statuses') as ImmutableList<Status>;
  const statusCount = statuses.count();
  const acct = report.getIn(['account', 'acct']) as string;
  const reporterAcct = report.getIn(['actor', 'acct']) as string;

  return (
    <div className='admin-report' key={report.get('id')}>
      <div className='admin-report__avatar'>
        <HoverRefWrapper accountId={report.getIn(['account', 'id']) as string} inline>
          <Link to={`/@${acct}`} title={acct}>
            <Avatar account={report.get('account')} size={32} />
          </Link>
        </HoverRefWrapper>
      </div>
      <div className='admin-report__content'>
        <h4 className='admin-report__title'>
          <FormattedMessage
            id='admin.reports.report_title'
            defaultMessage='Report on {acct}'
            values={{ acct: (
              <HoverRefWrapper accountId={report.getIn(['account', 'id']) as string} inline>
                <Link to={`/@${acct}`} title={acct}>@{acct}</Link>
              </HoverRefWrapper>
            ) }}
          />
        </h4>
        <div className='admin-report__statuses'>
          {statusCount > 0 && (
            <Accordion
              headline={`Reported posts (${statusCount})`}
              expanded={accordionExpanded}
              onToggle={handleAccordionToggle}
            >
              {statuses.map(status => <ReportStatus report={report} status={status} key={status.id} />)}
            </Accordion>
          )}
        </div>
        <div className='admin-report__quote'>
          {report.get('content', '').length > 0 && (
            <blockquote className='md' dangerouslySetInnerHTML={{ __html: report.get('content') }} />
          )}
          <span className='byline'>
            &mdash;
            <HoverRefWrapper accountId={report.getIn(['actor', 'id']) as string} inline>
              <Link to={`/@${reporterAcct}`} title={reporterAcct}>@{reporterAcct}</Link>
            </HoverRefWrapper>
          </span>
        </div>
      </div>
      <HStack space={2} alignItems='start'>
        <Button onClick={handleCloseReport}>
          <FormattedMessage id='admin.reports.actions.close' defaultMessage='Close' />
        </Button>

        <DropdownMenu items={menu} src={require('@tabler/icons/icons/dots-vertical.svg')} />
      </HStack>
    </div>
  );
};

export default Report;

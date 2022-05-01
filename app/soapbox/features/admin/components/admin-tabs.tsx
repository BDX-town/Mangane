import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useRouteMatch } from 'react-router-dom';

import { Tabs } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  dashboard: { id: 'admin_nav.dashboard', defaultMessage: 'Dashboard' },
  reports: { id: 'admin_nav.reports', defaultMessage: 'Reports' },
  waitlist: { id: 'admin_nav.awaiting_approval', defaultMessage: 'Waitlist' },
});

const AdminTabs: React.FC = () => {
  const intl = useIntl();
  const match = useRouteMatch();

  const approvalCount = useAppSelector(state => state.admin.awaitingApproval.count());
  const reportsCount = useAppSelector(state => state.admin.openReports.count());

  const tabs = [{
    name: '/soapbox/admin',
    text: intl.formatMessage(messages.dashboard),
    to: '/soapbox/admin',
  }, {
    name: '/soapbox/admin/reports',
    text: intl.formatMessage(messages.reports),
    to: '/soapbox/admin/reports',
    count: reportsCount,
  }, {
    name: '/soapbox/admin/approval',
    text: intl.formatMessage(messages.waitlist),
    to: '/soapbox/admin/approval',
    count: approvalCount,
  }];

  return <Tabs items={tabs} activeItem={match.path} />;
};

export default AdminTabs;

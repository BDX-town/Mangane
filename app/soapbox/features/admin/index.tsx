import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Switch, Route } from 'react-router-dom';

import { Column } from 'soapbox/components/ui';
import { useOwnAccount } from 'soapbox/hooks';

import AdminTabs from './components/admin-tabs';
import Waitlist from './tabs/awaiting-approval';
import Dashboard from './tabs/dashboard';
import Reports from './tabs/reports';

const messages = defineMessages({
  heading: { id: 'column.admin.dashboard', defaultMessage: 'Dashboard' },
});

const Admin: React.FC = () => {
  const intl = useIntl();
  const account = useOwnAccount();

  if (!account) return null;

  return (
    <Column label={intl.formatMessage(messages.heading)} withHeader={false}>
      <AdminTabs />

      <Switch>
        <Route path='/soapbox/admin' exact component={Dashboard} />
        <Route path='/soapbox/admin/reports' exact component={Reports} />
        <Route path='/soapbox/admin/approval' exact component={Waitlist} />
      </Switch>
    </Column>
  );
};

export default Admin;

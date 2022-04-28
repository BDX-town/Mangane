import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Switch, Route } from 'react-router-dom';

import { useOwnAccount } from 'soapbox/hooks';

import Column from '../ui/components/column';

import Waitlist from './awaiting_approval';
import AdminTabs from './components/admin-tabs';
import Reports from './reports';
import Dashboard from './tabs/dashboard';

const messages = defineMessages({
  heading: { id: 'column.admin.dashboard', defaultMessage: 'Dashboard' },
});

const Admin: React.FC = () => {
  const intl = useIntl();
  const account = useOwnAccount();

  if (!account) return null;

  return (
    <Column label={intl.formatMessage(messages.heading)} withHeader={false}>
      <AdminTabs activeItem='dashboard' />

      <Switch>
        <Route path='/admin' exact component={Dashboard} />
        <Route path='/admin/reports' exact component={Reports} />
        <Route path='/admin/approval' exact component={Waitlist} />
      </Switch>
    </Column>
  );
};

export default Admin;

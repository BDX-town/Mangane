import React, { useState, useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { fetchReports } from 'soapbox/actions/admin';
import ScrollableList from 'soapbox/components/scrollable_list';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetReport } from 'soapbox/selectors';

import Report from '../components/report';

const messages = defineMessages({
  heading: { id: 'column.admin.reports', defaultMessage: 'Reports' },
  modlog: { id: 'column.admin.reports.menu.moderation_log', defaultMessage: 'Moderation Log' },
  emptyMessage: { id: 'admin.reports.empty_message', defaultMessage: 'There are no open reports. If a user gets reported, they will show up here.' },
});

const getReport = makeGetReport();

const Reports: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(true);

  const reports = useAppSelector(state => {
    const ids = state.admin.openReports;
    return ids.toList().map(id => getReport(state, id));
  });

  useEffect(() => {
    dispatch(fetchReports())
      .then(() => setLoading(false))
      .catch(() => {});
  }, []);

  const showLoading = isLoading && reports.count() === 0;

  return (
    <ScrollableList
      isLoading={isLoading}
      showLoading={showLoading}
      scrollKey='admin-reports'
      emptyMessage={intl.formatMessage(messages.emptyMessage)}
    >
      {reports.map(report => <Report report={report} key={report.get('id')} />)}
    </ScrollableList>
  );
};

export default Reports;

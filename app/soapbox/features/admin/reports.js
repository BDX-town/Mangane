import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import ScrollableList from 'soapbox/components/scrollable_list';
import { fetchReports } from 'soapbox/actions/admin';
import Report from './components/report';
import { makeGetReport } from 'soapbox/selectors';

const messages = defineMessages({
  heading: { id: 'column.admin.reports', defaultMessage: 'Reports' },
  emptyMessage: { id: 'admin.reports.empty_message', defaultMessage: 'There are no open reports. If a user gets reported, they will show up here.' },
});

const mapStateToProps = state => {
  const getReport = makeGetReport();
  const ids = state.getIn(['admin', 'openReports']);

  return {
    reports: ids.toList().map(id => getReport(state, id)),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Reports extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    reports: ImmutablePropTypes.list.isRequired,
  };

  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchReports())
      .then(() => this.setState({ isLoading: false }))
      .catch(() => {});
  }

  render() {
    const { intl, reports } = this.props;
    const { isLoading } = this.state;
    const showLoading = isLoading && reports.count() === 0;

    return (
      <Column icon='gavel' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList
          isLoading={isLoading}
          showLoading={showLoading}
          scrollKey='admin-reports'
          emptyMessage={intl.formatMessage(messages.emptyMessage)}
        >
          {reports.map(report => <Report report={report} key={report.get('id')} />)}
        </ScrollableList>
      </Column>
    );
  }

}

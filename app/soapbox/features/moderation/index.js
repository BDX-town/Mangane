import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import snackbar from 'soapbox/actions/snackbar';
import Column from '../ui/components/column';
import ScrollableList from '../../components/scrollable_list';
import LoadGap from '../../components/load_gap';
import {
  SimpleForm,
  FieldsGroup,
  TextInput,
  Checkbox,
  FileChooser,
  SimpleTextarea,
} from 'soapbox/features/forms';
import {
  fetchReports,
} from '../../actions/admin';
import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import { patchMe } from 'soapbox/actions/me';
import { unescape, debounce } from 'lodash';


const messages = defineMessages({
  heading: { id: 'column.moderation', defaultMessage: 'Moderation' },
  open_reports: { id: 'column.moderation.open_reports', defaultMessage: 'Open Reports' },
});

const mapStateToProps = state => {
  return {
    open_report_count: state.getIn(['admin', 'open_report_count']),
    open_reports: state.getIn(['admin', 'reports']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Moderation extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
  }

  componentWillUnmount() {
    this.handleLoadOlder.cancel();
  }

  componentDidMount() {
    this.props.dispatch(fetchReports({ state: 'open' }));
  }

  handleLoadGap = () => {
    this.props.dispatch(fetchReports({ state: 'open' }));
  };

  handleLoadOlder = debounce(() => {
    const last = this.props.open_reports.last();
    this.props.dispatch(fetchReports({ state: 'open' }));
  }, 300, { leading: true });


  render() {
    const { intl, open_reports, isLoading, hasMore, open_report_count } = this.props;
    const emptyMessage = <FormattedMessage id='empty_column.open_reports' defaultMessage="There are no open reports." />;

    let scrollableContent = null;

    if (isLoading && this.scrollableContent) {
      scrollableContent = this.scrollableContent;
    } else if (open_reports.size > 0 || hasMore) {
      scrollableContent = open_reports.map((item, index) => item === null ? (
        <LoadGap
          key={'gap:' + open_reports.getIn([index + 1, 'id'])}
          disabled={isLoading}
          maxId={index > 0 ? open_reports.getIn([index - 1, 'id']) : null}
          onClick={this.handleLoadGap}
        />
      ) : (
        <FormattedMessage id='empty_column.report_test' defaultMessage="Open Report Item" />
        // <ReportContainer
        //   key={item.get('id')}
        //   report={item}
        //   accountId={item.get('account')}
        // />
      ));
    } else {
      scrollableContent = null;
    }

    this.scrollableContent = scrollableContent;

    return (
      <Column icon='gavel' heading={intl.formatMessage(messages.heading)} backBtnSlim>
      <ScrollableList
        scrollKey='open_reports'
        isLoading={isLoading}
        showLoading={isLoading && open_reports.size === 0}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
      >
        {scrollableContent}
      </ScrollableList>
      </Column>
    );
  }

}

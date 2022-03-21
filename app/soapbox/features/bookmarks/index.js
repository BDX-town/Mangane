import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import SubNavigation from 'soapbox/components/sub_navigation';
import { Column } from 'soapbox/components/ui';

import { fetchBookmarkedStatuses, expandBookmarkedStatuses } from '../../actions/bookmarks';
import StatusList from '../../components/status_list';

const messages = defineMessages({
  heading: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
});

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'bookmarks', 'items']),
  isLoading: state.getIn(['status_lists', 'bookmarks', 'isLoading'], true),
  hasMore: !!state.getIn(['status_lists', 'bookmarks', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class Bookmarks extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    shouldUpdateScroll: PropTypes.func,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  };

  fetchData = () => {
    const { dispatch } = this.props;
    return dispatch(fetchBookmarkedStatuses());
  }

  componentDidMount() {
    this.fetchData();
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandBookmarkedStatuses());
  }, 300, { leading: true })

  handleRefresh = () => {
    return this.fetchData();
  }

  render() {
    const { intl, shouldUpdateScroll, statusIds, columnId, multiColumn, hasMore, isLoading } = this.props;
    const pinned = !!columnId;

    const emptyMessage = <FormattedMessage id='empty_column.bookmarks' defaultMessage="You don't have any bookmarks yet. When you add one, it will show up here." />;

    return (
      <Column transparent>
        <SubNavigation message={intl.formatMessage(messages.heading)} />
        <StatusList
          trackScroll={!pinned}
          statusIds={statusIds}
          scrollKey={`bookmarked_statuses-${columnId}`}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          onRefresh={this.handleRefresh}
          shouldUpdateScroll={shouldUpdateScroll}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        />
      </Column>
    );
  }

}

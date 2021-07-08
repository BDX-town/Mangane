import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import StatusList from '../../components/status_list';
import { fetchBookmarkedStatuses, expandBookmarkedStatuses } from '../../actions/bookmarks';
import { debounce } from 'lodash';

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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchBookmarkedStatuses());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandBookmarkedStatuses());
  }, 300, { leading: true })


  render() {
    const { intl, shouldUpdateScroll, statusIds, columnId, multiColumn, hasMore, isLoading } = this.props;
    const pinned = !!columnId;

    const emptyMessage = <FormattedMessage id='empty_column.bookmarks' defaultMessage="You don't have any bookmarks yet. When you add one, it will show up here." />;

    return (
      <Column icon='bookmark' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <StatusList
          trackScroll={!pinned}
          statusIds={statusIds}
          scrollKey={`bookmarked_statuses-${columnId}`}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          shouldUpdateScroll={shouldUpdateScroll}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        />
      </Column>
    );
  }

}

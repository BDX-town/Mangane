import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { expandDirectTimeline } from '../../actions/timelines';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connectDirectStream } from '../../actions/streaming';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Direct messages' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'direct', 'unread']) > 0,
});

export default @connect(mapStateToProps)
@injectIntl
class DirectTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(expandDirectTimeline());
    this.disconnect = dispatch(connectDirectStream());
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    this.props.dispatch(expandDirectTimeline({ maxId }));
  }

  render() {
    const { intl, hasUnread } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='envelope'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
        />

        <StatusListContainer
          scrollKey='direct_timeline'
          timelineId='direct'
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.direct' defaultMessage="You don't have any direct messages yet. When you send or receive one, it will show up here." />}
        />
      </Column>
    );
  }

}

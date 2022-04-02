import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';
import SubNavigation from 'soapbox/components/sub_navigation';

import { connectCommunityStream } from '../../actions/streaming';
import { expandCommunityTimeline } from '../../actions/timelines';
import { Column } from '../../components/ui';
import StatusListContainer from '../ui/containers/status_list_container';

import ColumnSettings from './containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
});

const mapStateToProps = state => {
  const onlyMedia = getSettings(state).getIn(['community', 'other', 'onlyMedia']);

  const timelineId = 'community';

  return {
    timelineId,
    onlyMedia,
    hasUnread: state.getIn(['timelines', `${timelineId}${onlyMedia ? ':media' : ''}`, 'unread']) > 0,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class CommunityTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    timelineId: PropTypes.string,
  };

  componentDidMount() {
    const { dispatch, onlyMedia } = this.props;
    dispatch(expandCommunityTimeline({ onlyMedia }));
    this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia } = this.props;

      this.disconnect();
      dispatch(expandCommunityTimeline({ onlyMedia }));
      this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
    }
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia } = this.props;
    dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
  }

  handleRefresh = () => {
    const { dispatch, onlyMedia } = this.props;
    return dispatch(expandCommunityTimeline({ onlyMedia }));
  }


  render() {
    const { intl, onlyMedia, timelineId } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)} transparent>
        <SubNavigation message={intl.formatMessage(messages.title)} settings={ColumnSettings} />
        <StatusListContainer
          scrollKey={`${timelineId}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}`}
          onLoadMore={this.handleLoadMore}
          onRefresh={this.handleRefresh}
          emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
          divideType='space'
        />
      </Column>
    );
  }

}

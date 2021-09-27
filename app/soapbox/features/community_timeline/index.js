import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import { expandCommunityTimeline } from '../../actions/timelines';
import { connectCommunityStream } from '../../actions/streaming';
import { getSettings } from 'soapbox/actions/settings';
import SubNavigation from 'soapbox/components/sub_navigation';

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

  static contextTypes = {
    router: PropTypes.object,
  };

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

  render() {
    const { intl, onlyMedia, timelineId } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <SubNavigation message={intl.formatMessage(messages.title)} />
        <StatusListContainer
          scrollKey={`${timelineId}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
        />
      </Column>
    );
  }

}

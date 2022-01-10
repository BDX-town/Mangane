import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';
import IconButton from 'soapbox/components/icon_button';
import Column from 'soapbox/features/ui/components/column';

import { connectRemoteStream } from '../../actions/streaming';
import { expandRemoteTimeline } from '../../actions/timelines';
import StatusListContainer from '../ui/containers/status_list_container';

import PinnedHostsPicker from './components/pinned_hosts_picker';

const messages = defineMessages({
  title: { id: 'column.remote', defaultMessage: 'Federated timeline' },
});

const mapStateToProps = (state, props) => {
  const instance = props.params.instance;
  const settings = getSettings(state);
  const onlyMedia = settings.getIn(['remote', 'other', 'onlyMedia']);

  const timelineId = 'remote';

  return {
    timelineId,
    onlyMedia,
    hasUnread: state.getIn(['timelines', `${timelineId}${onlyMedia ? ':media' : ''}:${instance}`, 'unread']) > 0,
    instance,
    pinned: settings.getIn(['remote_timeline', 'pinnedHosts']).includes(instance),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class RemoteTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    timelineId: PropTypes.string,
    instance: PropTypes.string.isRequired,
    pinned: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch, onlyMedia, instance } = this.props;
    dispatch(expandRemoteTimeline(instance, { onlyMedia }));
    this.disconnect = dispatch(connectRemoteStream(instance, { onlyMedia }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia, instance } = this.props;
      this.disconnect();

      dispatch(expandRemoteTimeline(instance, { onlyMedia }));
      this.disconnect = dispatch(connectRemoteStream(instance, { onlyMedia }));
    }
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleCloseClick = e => {
    this.context.router.history.push('/timeline/fediverse');
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia, instance } = this.props;
    dispatch(expandRemoteTimeline(instance, { maxId, onlyMedia }));
  }

  render() {
    const { intl, onlyMedia, timelineId, instance, pinned } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)} heading={instance} transparent>
        <PinnedHostsPicker host={instance} />
        {!pinned && <div className='timeline-filter-message'>
          <IconButton src={require('@tabler/icons/icons/x.svg')} onClick={this.handleCloseClick} />
          <FormattedMessage
            id='remote_timeline.filter_message'
            defaultMessage='You are viewing the timeline of {instance}.'
            values={{ instance }}
          />
        </div>}
        <StatusListContainer
          scrollKey={`${timelineId}_${instance}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}:${instance}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={
            <FormattedMessage
              id='empty_column.remote'
              defaultMessage='There is nothing here! Manually follow users from {instance} to fill it up.'
              values={{ instance }}
            />
          }
        />
      </Column>
    );
  }

}

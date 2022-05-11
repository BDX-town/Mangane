import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import IconButton from 'soapbox/components/icon_button';
import Column from 'soapbox/features/ui/components/column';
import { useAppDispatch, useSettings } from 'soapbox/hooks';

import { connectRemoteStream } from '../../actions/streaming';
import { expandRemoteTimeline } from '../../actions/timelines';
import StatusListContainer from '../ui/containers/status_list_container';

import PinnedHostsPicker from './components/pinned_hosts_picker';

const messages = defineMessages({
  title: { id: 'column.remote', defaultMessage: 'Federated timeline' },
});

interface IRemoteTimeline {
  params?: {
    instance?: string,
  }
}

/** View statuses from a remote instance. */
const RemoteTimeline: React.FC<IRemoteTimeline> = ({ params }) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const instance = params?.instance;
  const settings = useSettings();

  const stream = useRef<any>(null);

  const timelineId = 'remote';
  const onlyMedia = !!settings.getIn(['remote', 'other', 'onlyMedia']);

  const pinned: boolean = (settings.getIn(['remote_timeline', 'pinnedHosts']) as any).includes(instance);

  const disconnect = () => {
    if (stream.current) {
      stream.current();
    }
  };

  const handleCloseClick: React.MouseEventHandler = () => {
    history.push('/timeline/fediverse');
  };

  const handleLoadMore = (maxId: string) => {
    dispatch(expandRemoteTimeline(instance, { maxId, onlyMedia }));
  };

  useEffect(() => {
    disconnect();
    dispatch(expandRemoteTimeline(instance, { onlyMedia, maxId: undefined }));
    stream.current = dispatch(connectRemoteStream(instance, { onlyMedia }));

    return () => {
      disconnect();
      stream.current = null;
    };
  }, [onlyMedia]);

  return (
    <Column label={intl.formatMessage(messages.title)} heading={instance} transparent>
      {instance && <PinnedHostsPicker host={instance} />}
      {!pinned && <div className='timeline-filter-message'>
        <IconButton src={require('@tabler/icons/icons/x.svg')} onClick={handleCloseClick} />
        <FormattedMessage
          id='remote_timeline.filter_message'
          defaultMessage='You are viewing the timeline of {instance}.'
          values={{ instance }}
        />
      </div>}
      <StatusListContainer
        scrollKey={`${timelineId}_${instance}_timeline`}
        timelineId={`${timelineId}${onlyMedia ? ':media' : ''}:${instance}`}
        onLoadMore={handleLoadMore}
        emptyMessage={
          <FormattedMessage
            id='empty_column.remote'
            defaultMessage='There is nothing here! Manually follow users from {instance} to fill it up.'
            values={{ instance }}
          />
        }
        divideType='space'
      />
    </Column>
  );
};

export default RemoteTimeline;

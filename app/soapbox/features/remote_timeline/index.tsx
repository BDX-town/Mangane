import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { connectRemoteStream } from 'soapbox/actions/streaming';
import { expandRemoteTimeline } from 'soapbox/actions/timelines';
import Column from 'soapbox/features/ui/components/column';
import { useAppDispatch, useSettings } from 'soapbox/hooks';
import { isMobile } from 'soapbox/is_mobile';

import Timeline from '../ui/components/timeline';

import PinnedHostsPicker from './components/pinned_hosts_picker';

const messages = defineMessages({
  title: { id: 'remote_timeline.filter_message', defaultMessage: 'You are viewing the timeline of {instance}.' },
});

interface IRemoteTimeline {
  params?: {
    instance?: string,
  }
}

/** View statuses from a remote instance. */
const RemoteTimeline: React.FC<IRemoteTimeline> = ({ params }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const instance = params?.instance as string;
  const settings = useSettings();

  const stream = useRef<any>(null);

  const timelineId = 'remote';
  const onlyMedia = !!settings.getIn(['remote', 'other', 'onlyMedia']);

  const disconnect = () => {
    if (stream.current) {
      stream.current();
    }
  };

  const handleLoadMore = (maxId: string) => {
    dispatch(expandRemoteTimeline(instance, { maxId, onlyMedia }));
  };

  useEffect(() => {
    disconnect();
    dispatch(expandRemoteTimeline(instance, { onlyMedia, maxId: undefined }));

    if (!isMobile(window.innerWidth)) {
      stream.current = dispatch(connectRemoteStream(instance, { onlyMedia }));

      return () => {
        disconnect();
        stream.current = null;
      };
    }
  }, [onlyMedia]);

  return (
    <div className='pt-3'>
      <Column label={instance} heading={intl.formatMessage(messages.title, { instance })} transparent withHeader={false}>
        {instance && <PinnedHostsPicker host={instance} />}
        <Timeline
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
    </div>
  );
};

export default RemoteTimeline;

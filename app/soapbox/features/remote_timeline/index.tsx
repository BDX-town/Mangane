import React, { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { connectRemoteStream } from 'soapbox/actions/streaming';
import { expandRemoteTimeline } from 'soapbox/actions/timelines';
import Column from 'soapbox/features/ui/components/column';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';
import { isMobile } from 'soapbox/is_mobile';
import { makeGetRemoteInstance } from 'soapbox/selectors';

import Timeline from '../ui/components/timeline';

import { ButtonPin } from './components/ButtonPin';





interface IRemoteTimeline {
  params?: {
    instance?: string,
  }
}

const Heading = ({ instance }: {instance: string }) => {
  const getRemoteInstance = makeGetRemoteInstance();
  const meta = useAppSelector((s) => getRemoteInstance(s, instance));
  return (
    <div className='flex gap-2 items-center'>
      {
        meta.get('favicon') && <img alt={`${instance} favicon`} src={meta.get('favicon') as string} width={24} height={24} />
      }
      { instance }
      <ButtonPin instance={instance} width={20} height={20}  />
    </div>
  );
};

/** View statuses from a remote instance. */
const RemoteTimeline: React.FC<IRemoteTimeline> = ({ params }) => {
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

  const completeTimelineId = `${timelineId}${onlyMedia ? ':media' : ''}:${instance}`;

  return (
    <div className='pt-3'>
      <Column label={instance} heading={<Heading instance={instance} />} transparent withHeader={false}>
        <div className='mb-4'>
          { instance && <FormattedMessage id='remote_timeline.filter_message' defaultMessage='You are viewing the local timeline of {instance}.' values={{ instance }} />}
        </div>
        <Timeline
          scrollKey={`${timelineId}_${instance}_timeline`}
          timelineId={completeTimelineId}
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

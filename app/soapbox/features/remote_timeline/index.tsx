import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { connectRemoteStream } from 'soapbox/actions/streaming';
import { expandRemoteTimeline } from 'soapbox/actions/timelines';
import SubNavigation from 'soapbox/components/sub_navigation';
import TimelineSettings from 'soapbox/components/timeline_settings';
import { IconButton } from 'soapbox/components/ui';
import Column from 'soapbox/features/ui/components/column';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';
import { isMobile } from 'soapbox/is_mobile';
import { makeGetRemoteInstance } from 'soapbox/selectors';

import Timeline from '../ui/components/timeline';

import { ButtonPin } from './components/button-pin';

const messages = defineMessages({
  settings: { id: 'settings.settings', defaultMessage: 'Settings' },
});

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
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const instance = params?.instance as string;

  const stream = useRef<any>(null);

  const timelineId = `remote:${instance}`;

  const [showSettings, setShowSettings] = useState(false);
  const settings = useSettings();
  const onlyMedia = settings.getIn([timelineId, 'other', 'onlyMedia']);
  const excludeReplies = settings.getIn([timelineId, 'shows', 'reply']);

  const disconnect = () => {
    if (stream.current) {
      stream.current();
    }
  };

  const handleLoadMore = (maxId: string) => {
    dispatch(expandRemoteTimeline(instance, { maxId, onlyMedia, excludeReplies }));
  };

  useEffect(() => {
    disconnect();
    dispatch(expandRemoteTimeline(instance, { onlyMedia, maxId: undefined, excludeReplies }));

    if (!isMobile(window.innerWidth)) {
      stream.current = dispatch(connectRemoteStream(instance, { onlyMedia, excludeReplies }));

      return () => {
        disconnect();
        stream.current = null;
      };
    }
  }, [dispatch, excludeReplies, instance, onlyMedia]);


  return (
    <div className='pt-3'>
      <Column label={instance} transparent withHeader={false}>
        <div className='px-4 py-4 flex justify-between items-center'>
          <SubNavigation className='!mb-0'>
            <Heading instance={instance} />
          </SubNavigation>
          <IconButton
            src={!showSettings ? require('@tabler/icons/chevron-down.svg') : require('@tabler/icons/chevron-up.svg')}
            onClick={() => setShowSettings(!showSettings)}
            title={intl.formatMessage(messages.settings)}
          />
        </div>
        {
          showSettings && <TimelineSettings className='mb-3' timeline={timelineId} onClose={() => setShowSettings(false)} />
        }
        <div className='mb-4 px-4 sm:p-0'>
          { instance && <FormattedMessage id='remote_timeline.filter_message' defaultMessage='You are viewing the local timeline of {instance}.' values={{ instance }} />}
        </div>
        <Timeline
          scrollKey={`${timelineId}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}${excludeReplies ? ':exclude_replies' : ''}`}
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

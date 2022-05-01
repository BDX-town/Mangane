import classNames from 'classnames';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import React from 'react';

import StatusContainer from 'soapbox/containers/status_container';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import { useAppSelector } from 'soapbox/hooks';

interface IThreadStatus {
  id: string,
  focusedStatusId: string,
}

const ThreadStatus: React.FC<IThreadStatus> = (props): JSX.Element => {
  const { id, focusedStatusId } = props;

  const replyToId = useAppSelector(state => state.contexts.getIn(['inReplyTos', id]));
  const replyCount = useAppSelector(state => state.contexts.getIn(['replies', id], ImmutableOrderedSet()).size);
  const isLoaded = useAppSelector(state => Boolean(state.statuses.get(id)));

  const renderConnector = (): JSX.Element | null => {
    const isConnectedTop = replyToId && replyToId !== focusedStatusId;
    const isConnectedBottom = replyCount > 0;
    const isConnected = isConnectedTop || isConnectedBottom;

    if (!isConnected) return null;

    return (
      <div
        className={classNames('thread__connector', {
          'thread__connector--top': isConnectedTop,
          'thread__connector--bottom': isConnectedBottom,
        })}
      />
    );
  };

  return (
    <div className='thread__status'>
      {renderConnector()}
      {isLoaded ? (
        // @ts-ignore FIXME
        <StatusContainer {...props} />
      ) : (
        <PlaceholderStatus thread />
      )}
    </div>
  );
};

export default ThreadStatus;

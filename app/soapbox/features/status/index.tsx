import classNames from 'classnames';
import { List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { createSelector } from 'reselect';

import {
  replyCompose,
  mentionCompose,
} from 'soapbox/actions/compose';
import {
  favourite,
  unfavourite,
  reblog,
  unreblog,
} from 'soapbox/actions/interactions';
import { openModal } from 'soapbox/actions/modals';
import { getSettings } from 'soapbox/actions/settings';
import {
  hideStatus,
  revealStatus,
  fetchStatusWithContext,
  fetchNext,
  translateStatus,
} from 'soapbox/actions/statuses';
import MissingIndicator from 'soapbox/components/missing_indicator';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import ScrollableList from 'soapbox/components/scrollable_list';
import StatusActionBar from 'soapbox/components/status-action-bar';
import Sticky from 'soapbox/components/sticky';
import SubNavigation from 'soapbox/components/sub_navigation';
import Tombstone from 'soapbox/components/tombstone';
import { Column, Stack } from 'soapbox/components/ui';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import PendingStatus from 'soapbox/features/ui/components/pending_status';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';
import { defaultMediaVisibility, textForScreenReader } from 'soapbox/utils/status';

import DetailedStatus from './components/detailed-status';
import ThreadLoginCta from './components/thread-login-cta';
import ThreadStatus from './components/thread-status';

import type { VirtuosoHandle } from 'react-virtuoso';
import type { RootState } from 'soapbox/store';
import type {
  Account as AccountEntity,
  Attachment as AttachmentEntity,
  Status as StatusEntity,
} from 'soapbox/types/entities';


const messages = defineMessages({
  title: { id: 'status.title', defaultMessage: '@{username}\'s Post' },
  titleDirect: { id: 'status.title_direct', defaultMessage: 'Direct message' },
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteHeading: { id: 'confirmations.delete.heading', defaultMessage: 'Delete post' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this post?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftHeading: { id: 'confirmations.redraft.heading', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this post and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned.' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  revealAll: { id: 'status.show_more_all', defaultMessage: 'Show more for all' },
  hideAll: { id: 'status.show_less_all', defaultMessage: 'Show less for all' },
  detailedStatus: { id: 'status.detailed_status', defaultMessage: 'Detailed conversation view' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

const getStatus = makeGetStatus();

const getAncestorsIds = createSelector([
  (_: RootState, statusId: string | undefined) => statusId,
  (state: RootState) => state.contexts.inReplyTos,
], (statusId, inReplyTos) => {
  let ancestorsIds = ImmutableOrderedSet<string>();
  let id: string | undefined = statusId;

  while (id && !ancestorsIds.includes(id)) {
    ancestorsIds = ImmutableOrderedSet([id]).union(ancestorsIds);
    id = inReplyTos.get(id);
  }

  return ancestorsIds;
});

const getDescendantsIds = createSelector([
  (_: RootState, statusId: string) => statusId,
  (state: RootState) => state.contexts.replies,
], (statusId, contextReplies) => {
  let descendantsIds = ImmutableOrderedSet<string>();
  const ids = [statusId];

  while (ids.length > 0) {
    const id = ids.shift();
    if (!id) break;

    const replies = contextReplies.get(id);

    if (descendantsIds.includes(id)) {
      break;
    }

    if (statusId !== id) {
      descendantsIds = descendantsIds.union([id]);
    }

    if (replies) {
      replies.reverse().forEach((reply: string) => {
        ids.unshift(reply);
      });
    }
  }

  return descendantsIds;
});

type DisplayMedia = 'default' | 'hide_all' | 'show_all';
type RouteParams = { statusId: string };

interface IThread {
  params: RouteParams,
  onOpenMedia: (media: ImmutableList<AttachmentEntity>, index: number) => void,
  onOpenVideo: (video: AttachmentEntity, time: number) => void,
}

const Thread: React.FC<IThread> = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const settings = useSettings();

  const me = useAppSelector(state => state.me);
  const status = useAppSelector(state => getStatus(state, { id: props.params.statusId }));
  const displayMedia = settings.get('displayMedia') as DisplayMedia;
  const askReplyConfirmation = useAppSelector(state => state.compose.text.trim().length !== 0);

  const { ancestorsIds, descendantsIds } = useAppSelector(state => {
    let ancestorsIds = ImmutableOrderedSet<string>();
    let descendantsIds = ImmutableOrderedSet<string>();

    if (status) {
      const statusId = status.id;
      ancestorsIds = getAncestorsIds(state, state.contexts.inReplyTos.get(statusId));
      descendantsIds = getDescendantsIds(state, statusId);
      ancestorsIds = ancestorsIds.delete(statusId).subtract(descendantsIds);
      descendantsIds = descendantsIds.delete(statusId).subtract(ancestorsIds);
    }

    return {
      status,
      ancestorsIds,
      descendantsIds,
    };
  });

  const [showMedia, setShowMedia] = useState<boolean>(defaultMediaVisibility(status, displayMedia));
  const [isLoaded, setIsLoaded] = useState<boolean>(!!status);
  const [next, setNext] = useState<string>();

  const node = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<VirtuosoHandle>(null);

  /** Fetch the status (and context) from the API. */
  const fetchData = async() => {
    const { params } = props;
    const { statusId } = params;
    const { next } = await dispatch(fetchStatusWithContext(statusId));
    setNext(next);
  };

  // Load data.
  useEffect(() => {
    fetchData().then(() => {
      setIsLoaded(true);
    }).catch(error => {
      setIsLoaded(true);
    });
  }, [props.params.statusId]);

  const handleToggleMediaVisibility = () => {
    setShowMedia(!showMedia);
  };

  const handleHotkeyReact = () => {
    if (statusRef.current) {
      const firstEmoji: HTMLButtonElement | null = statusRef.current.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
      firstEmoji?.focus();
    }
  };

  const handleFavouriteClick = (status: StatusEntity) => {
    if (status.favourited) {
      dispatch(unfavourite(status));
    } else {
      dispatch(favourite(status));
    }
  };

  const handleReplyClick = (status: StatusEntity) => {
    if (askReplyConfirmation) {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(messages.replyMessage),
        confirm: intl.formatMessage(messages.replyConfirm),
        onConfirm: () => dispatch(replyCompose(status)),
      }));
    } else {
      dispatch(replyCompose(status));
    }
  };

  const handleModalReblog = (status: StatusEntity) => {
    dispatch(reblog(status));
  };

  const handleReblogClick = (status: StatusEntity, e?: React.MouseEvent) => {
    dispatch((_, getState) => {
      const boostModal = getSettings(getState()).get('boostModal');
      if (status.reblogged) {
        dispatch(unreblog(status));
      } else {
        if ((e && e.shiftKey) || !boostModal) {
          handleModalReblog(status);
        } else {
          dispatch(openModal('BOOST', { status, onReblog: handleModalReblog }));
        }
      }
    });
  };

  const handleMentionClick = (account: AccountEntity) => {
    dispatch(mentionCompose(account));
  };

  const handleOpenMedia = (media: ImmutableList<AttachmentEntity>, index: number) => {
    dispatch(openModal('MEDIA', { media, index }));
  };

  const handleOpenVideo = (media: ImmutableList<AttachmentEntity>, time: number) => {
    dispatch(openModal('VIDEO', { media, time }));
  };

  const handleHotkeyOpenMedia = (e?: KeyboardEvent) => {
    const { onOpenMedia, onOpenVideo } = props;
    const firstAttachment = status?.media_attachments.get(0);

    e?.preventDefault();

    if (status && firstAttachment) {
      if (firstAttachment.type === 'video') {
        onOpenVideo(firstAttachment, 0);
      } else {
        onOpenMedia(status.media_attachments, 0);
      }
    }
  };

  const handleToggleHidden = (status: StatusEntity) => {
    if (status.hidden) {
      dispatch(revealStatus(status.id));
    } else {
      dispatch(hideStatus(status.id));
    }
  };

  const handleHotkeyMoveUp = () => {
    handleMoveUp(status!.id);
  };

  const handleHotkeyMoveDown = () => {
    handleMoveDown(status!.id);
  };

  const handleHotkeyReply = (e?: KeyboardEvent) => {
    e?.preventDefault();
    handleReplyClick(status!);
  };

  const handleHotkeyFavourite = () => {
    handleFavouriteClick(status!);
  };

  const handleHotkeyBoost = () => {
    handleReblogClick(status!);
  };

  const handleHotkeyMention = (e?: KeyboardEvent) => {
    e?.preventDefault();
    const { account } = status!;
    if (!account || typeof account !== 'object') return;
    handleMentionClick(account);
  };

  const handleHotkeyOpenProfile = () => {
    history.push(`/@${status!.getIn(['account', 'acct'])}`);
  };

  const handleHotkeyToggleHidden = () => {
    handleToggleHidden(status!);
  };

  const handleHotkeyToggleSensitive = () => {
    handleToggleMediaVisibility();
  };

  const handleTranslate = React.useCallback((status: StatusEntity, language: string) => {
    dispatch(translateStatus(status.id, language));
  }, []);

  const handleMoveUp = (id: string) => {
    if (id === status?.id) {
      _selectChild(ancestorsIds.size - 1);
    } else {
      let index = ImmutableList(ancestorsIds).indexOf(id);

      if (index === -1) {
        index = ImmutableList(descendantsIds).indexOf(id);
        _selectChild(ancestorsIds.size + index);
      } else {
        _selectChild(index - 1);
      }
    }
  };

  const handleMoveDown = (id: string) => {
    if (id === status?.id) {
      _selectChild(ancestorsIds.size + 1);
    } else {
      let index = ImmutableList(ancestorsIds).indexOf(id);

      if (index === -1) {
        index = ImmutableList(descendantsIds).indexOf(id);
        _selectChild(ancestorsIds.size + index + 2);
      } else {
        _selectChild(index + 1);
      }
    }
  };

  const _selectChild = (index: number) => {
    scroller.current?.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const element = document.querySelector<HTMLDivElement>(`#thread [data-index="${index}"] .focusable`);

        if (element) {
          element.focus();
        }
      },
    });
  };

  const renderTombstone = (id: string) => {
    return (
      <div className='py-4 pb-8'>
        <Tombstone
          key={id}
          id={id}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      </div>
    );
  };

  const renderStatus = (id: string) => {
    return (
      <ThreadStatus
        key={id}
        id={id}
        focusedStatusId={status!.id}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />
    );
  };

  const renderPendingStatus = (id: string) => {
    const idempotencyKey = id.replace(/^末pending-/, '');

    return (
      <PendingStatus
        className='thread__status'
        key={id}
        idempotencyKey={idempotencyKey}
      />
    );
  };

  const renderChildren = (list: ImmutableOrderedSet<string>) => {
    return list.map(id => {
      if (id.endsWith('-tombstone')) {
        return renderTombstone(id);
      } else if (id.startsWith('末pending-')) {
        return renderPendingStatus(id);
      } else {
        return renderStatus(id);
      }
    });
  };

  // Reset media visibility if status changes.
  useEffect(() => {
    setShowMedia(defaultMediaVisibility(status, displayMedia));
  }, [status?.id]);

  // Scroll focused status into view when thread updates.
  useEffect(() => {
    scroller.current?.scrollToIndex({
      index: ancestorsIds.size,
      offset: -80,
    });

    setImmediate(() => statusRef.current?.querySelector<HTMLDivElement>('.detailed-status')?.focus());
  }, [props.params.statusId, status?.id, ancestorsIds.size, isLoaded]);

  const handleRefresh = () => {
    return fetchData();
  };

  const handleLoadMore = useCallback(debounce(() => {
    if (next && status) {
      dispatch(fetchNext(status.id, next)).then(({ next }) => {
        setNext(next);
      }).catch(() => {});
    }
  }, 300, { leading: true }), [next, status]);

  const handleOpenCompareHistoryModal = (status: StatusEntity) => {
    dispatch(openModal('COMPARE_HISTORY', {
      statusId: status.id,
    }));
  };

  const hasAncestors = ancestorsIds.size > 0;
  const hasDescendants = descendantsIds.size > 0;

  if (!status && isLoaded) {
    return (
      <MissingIndicator />
    );
  } else if (!status) {
    return (
      <PlaceholderStatus />
    );
  }

  type HotkeyHandlers = { [key: string]: (keyEvent?: KeyboardEvent) => void };

  const handlers: HotkeyHandlers = {
    moveUp: handleHotkeyMoveUp,
    moveDown: handleHotkeyMoveDown,
    reply: handleHotkeyReply,
    favourite: handleHotkeyFavourite,
    boost: handleHotkeyBoost,
    mention: handleHotkeyMention,
    openProfile: handleHotkeyOpenProfile,
    toggleHidden: handleHotkeyToggleHidden,
    toggleSensitive: handleHotkeyToggleSensitive,
    openMedia: handleHotkeyOpenMedia,
    react: handleHotkeyReact,
  };

  const username = String(status.getIn(['account', 'acct']));
  const titleMessage = status.visibility === 'direct' ? messages.titleDirect : messages.title;

  const focusedStatus = (
    <div className={classNames('thread__detailed-status', { 'pb-4': hasDescendants })} key={status.id}>
      <HotKeys handlers={handlers}>
        <div
          ref={statusRef}
          className='detailed-status__wrapper focusable'
          tabIndex={0}
          // FIXME: no "reblogged by" text is added for the screen reader
          aria-label={textForScreenReader(intl, status)}
        >
          <DetailedStatus
            status={status}
            onOpenVideo={handleOpenVideo}
            onOpenMedia={handleOpenMedia}
            onToggleHidden={handleToggleHidden}
            showMedia={showMedia}
            onToggleMediaVisibility={handleToggleMediaVisibility}
            onOpenCompareHistoryModal={handleOpenCompareHistoryModal}
            onTranslate={handleTranslate}
          />

          <hr className='mb-2 dark:border-slate-600' />

          <StatusActionBar
            status={status}
            expandable={false}
            space='expand'
            withLabels
          />
        </div>
      </HotKeys>

      {hasDescendants && (
        <hr className='mt-2 dark:border-slate-600' />
      )}
    </div>
  );

  const children: JSX.Element[] = [];

  if (hasAncestors) {
    children.push(...renderChildren(ancestorsIds).toArray());
  }

  children.push(focusedStatus);

  if (hasDescendants) {
    children.push(...renderChildren(descendantsIds).toArray());
  }

  return (
    <Column label={intl.formatMessage(titleMessage, { username })} transparent withHeader={false}>
      <Sticky stickyClassName='sm:hidden w-full shadow-lg before:-z-10 before:bg-gradient-sm before:w-full before:h-full before:absolute before:top-0 before:left-0  bg-white dark:bg-slate-900'>
        <div className='px-4 pt-4 sm:p-0'>
          <SubNavigation message={intl.formatMessage(titleMessage, { username })} />
        </div>
      </Sticky>

      <PullToRefresh onRefresh={handleRefresh}>
        <Stack space={2}>
          <div ref={node} className='thread'>
            <ScrollableList
              id='thread'
              ref={scroller}
              hasMore={!!next}
              onLoadMore={handleLoadMore}
              placeholderComponent={() => <PlaceholderStatus thread />}
              initialTopMostItemIndex={ancestorsIds.size}
            >
              {children}
            </ScrollableList>
          </div>

          {!me && <ThreadLoginCta />}
        </Stack>
      </PullToRefresh>
    </Column>
  );
};

export default Thread;

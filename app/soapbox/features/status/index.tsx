import classNames from 'classnames';
import { List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import {
  mentionCompose,
  replyCompose,
  submitCompose,
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
import { defaultMediaVisibility, textForScreenReader } from 'soapbox/utils/status';

import ComposeFormContainer from '../compose/containers/compose_form_container';

import DetailedStatus from './components/detailed-status';
import ThreadLoginCta from './components/thread-login-cta';
import ThreadStatus from './components/thread-status';
import { useThread } from './hooks/useThread';

import type { VirtuosoHandle } from 'react-virtuoso';
import type {
  Account as AccountEntity,
  Attachment as AttachmentEntity,
  Status as StatusEntity,
} from 'soapbox/types/entities';

type HotkeyHandlers = { [key: string]: (keyEvent?: KeyboardEvent) => void };

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
  const displayMedia = settings.get('displayMedia') as DisplayMedia;

  const {
    actualStatus,
    ancestorsIds,
    descendantsIds,
    isLoaded,
    next,
    handleRefresh,
    handleLoadMore,
  } = useThread(props.params.statusId);

  const [showMedia, setShowMedia] = useState<boolean>(defaultMediaVisibility(actualStatus, displayMedia));

  const node = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<VirtuosoHandle>(null);

  const handleToggleMediaVisibility = useCallback(() => {
    setShowMedia(prev => !prev);
  }, []);

  const handleHotkeyReact = useCallback(() => {
    if (statusRef.current) {
      const firstEmoji: HTMLButtonElement | null = statusRef.current.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
      firstEmoji?.focus();
    }
  }, []);

  const handleFavouriteClick = useCallback((status: StatusEntity) => {
    if (status.favourited) {
      dispatch(unfavourite(status));
    } else {
      dispatch(favourite(status));
    }
  }, [dispatch]);

  const handleModalReblog = useCallback((status: StatusEntity) => {
    dispatch(reblog(status));
  }, [dispatch]);

  const handleReblogClick = useCallback((status: StatusEntity, e?: React.MouseEvent) => {
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
  }, [dispatch, handleModalReblog]);

  const handleMentionClick = useCallback((account: AccountEntity) => {
    dispatch(mentionCompose(account));
  }, [dispatch]);

  const handleOpenMedia = useCallback((media: ImmutableList<AttachmentEntity>, index: number) => {
    dispatch(openModal('MEDIA', { media, index }));
  }, [dispatch]);

  const handleOpenVideo = useCallback((media: ImmutableList<AttachmentEntity>, time: number) => {
    dispatch(openModal('VIDEO', { media, time }));
  }, [dispatch]);

  const handleHotkeyOpenMedia = useCallback((e?: KeyboardEvent) => {
    const { onOpenMedia, onOpenVideo } = props;
    const firstAttachment = actualStatus?.media_attachments.get(0);

    e?.preventDefault();

    if (actualStatus && firstAttachment) {
      if (firstAttachment.type === 'video') {
        onOpenVideo(firstAttachment, 0);
      } else {
        onOpenMedia(actualStatus.media_attachments, 0);
      }
    }
  }, [props, actualStatus]);

  const handleToggleHidden = useCallback((status: StatusEntity) => {
    if (status.hidden) {
      dispatch(revealStatus(status.id));
    } else {
      dispatch(hideStatus(status.id));
    }
  }, [dispatch]);

  const handleHotkeyFavourite = useCallback(() => {
    handleFavouriteClick(actualStatus!);
  }, [handleFavouriteClick, actualStatus]);

  const handleHotkeyBoost = useCallback(() => {
    handleReblogClick(actualStatus!);
  }, [handleReblogClick, actualStatus]);

  const handleHotkeyMention = useCallback((e?: KeyboardEvent) => {
    e?.preventDefault();
    const { account } = actualStatus!;
    if (!account || typeof account !== 'object') return;
    handleMentionClick(account);
  }, [handleMentionClick, actualStatus]);

  const handleHotkeyOpenProfile = useCallback(() => {
    history.push(`/@${actualStatus!.getIn(['account', 'acct'])}`);
  }, [history, actualStatus]);

  const handleHotkeyToggleHidden = useCallback(() => {
    handleToggleHidden(actualStatus!);
  }, [handleToggleHidden, actualStatus]);

  const handleTranslate = React.useCallback((status: StatusEntity, language: string) => {
    dispatch(translateStatus(status.id, language));
  }, [dispatch]);

  const _selectChild = useCallback((index: number) => {
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
  }, []);

  const handleMoveUp = useCallback((id: string) => {
    if (id === actualStatus?.id) {
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
  }, [_selectChild, ancestorsIds, descendantsIds, actualStatus?.id]);

  const handleHotkeyMoveUp = useCallback(() => {
    handleMoveUp(actualStatus!.id);
  }, [handleMoveUp, actualStatus]);

  const handleMoveDown = useCallback((id: string) => {
    if (id === actualStatus?.id) {
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
  }, [_selectChild, ancestorsIds, descendantsIds, actualStatus?.id]);

  const handleHotkeyMoveDown = useCallback(() => {
    handleMoveDown(actualStatus!.id);
  }, [handleMoveDown, actualStatus]);

  const renderTombstone = useCallback((id: string) => {
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
  }, [handleMoveDown, handleMoveUp]);

  const renderStatus = useCallback((id: string) => {
    return (
      <ThreadStatus
        key={id}
        id={id}
        focusedStatusId={actualStatus!.id}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />
    );
  }, [handleMoveDown, handleMoveUp, actualStatus]);

  const renderPendingStatus = useCallback((id: string) => {
    const idempotencyKey = id.replace(/^末pending-/, '');

    return (
      <PendingStatus
        className='thread__status'
        key={id}
        idempotencyKey={idempotencyKey}
      />
    );
  }, []);

  const renderChildren = useCallback((list: ImmutableOrderedSet<string>) => {
    return list.map(id => {
      if (id.endsWith('-tombstone')) {
        return renderTombstone(id);
      } else if (id.startsWith('末pending-')) {
        return renderPendingStatus(id);
      } else {
        return renderStatus(id);
      }
    });
  }, [renderPendingStatus, renderStatus, renderTombstone]);

  // Reset media visibility if status changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    // setShowMedia(defaultMediaVisibility(status, displayMedia));
  }, [displayMedia, actualStatus, actualStatus?.id]);

  // Scroll focused status into view when thread updates.
  useEffect(() => {
    // scroller.current?.scrollToIndex({
    //   index: ancestorsIds.size,
    //   offset: -80,
    // });

    const id = setImmediate(() => statusRef.current?.querySelector<HTMLDivElement>('.detailed-status')?.focus());
    return () => clearImmediate(id);
  }, [props.params.statusId, actualStatus?.id, ancestorsIds.size, isLoaded]);

  const handleOpenCompareHistoryModal = useCallback((status: StatusEntity) => {
    dispatch(openModal('COMPARE_HISTORY', {
      statusId: status.id,
    }));
  }, [dispatch]);

  const hasAncestors = ancestorsIds.size > 0;
  const hasDescendants = descendantsIds.size > 0;

  const handlers: HotkeyHandlers = useMemo(() => ({
    moveUp: handleHotkeyMoveUp,
    moveDown: handleHotkeyMoveDown,
    favourite: handleHotkeyFavourite,
    boost: handleHotkeyBoost,
    mention: handleHotkeyMention,
    openProfile: handleHotkeyOpenProfile,
    toggleHidden: handleHotkeyToggleHidden,
    toggleSensitive: handleToggleMediaVisibility,
    openMedia: handleHotkeyOpenMedia,
    react: handleHotkeyReact,
  }), [handleHotkeyBoost, handleHotkeyFavourite, handleHotkeyMention, handleHotkeyMoveDown, handleHotkeyMoveUp, handleHotkeyOpenMedia, handleHotkeyOpenProfile, handleHotkeyReact, handleHotkeyToggleHidden, handleToggleMediaVisibility]);

  const username = String(actualStatus?.getIn(['account', 'acct']) || '');
  const titleMessage = actualStatus?.visibility === 'direct' ? messages.titleDirect : messages.title;

  const composingReplyTo = useRef(null);
  useEffect(() => {
    if (!actualStatus || !me || composingReplyTo.current === actualStatus.id) return undefined;
    dispatch(replyCompose(actualStatus));
    composingReplyTo.current = actualStatus.id;
  }, [actualStatus, dispatch, me]);

  const handleComposeSubmit = useCallback((_router, _group) => {
    dispatch(submitCompose(false, (data) => {
      const url = new URL(data.url);
      history.push(url.pathname);
    }));
  }, [dispatch, history]);

  const onDeleteStatus = useCallback(() => {
    if (actualStatus?.in_reply_to_id) {
      history.push(`/notice/${actualStatus.in_reply_to_id}`);
    } else {
      history.push('/');
    }
  }, [actualStatus, history]);

  const focusedStatus = useMemo(() => !actualStatus ? null : (
    <>
      <div className={classNames('thread__detailed-status')} key={actualStatus.id}>
        <HotKeys handlers={handlers}>
          <div
            ref={statusRef}
            className='detailed-status__wrapper focusable'
            tabIndex={0}
            // FIXME: no "reblogged by" text is added for the screen reader
            aria-label={textForScreenReader(intl, actualStatus)}
          >
            <DetailedStatus
              status={actualStatus}
              onOpenVideo={handleOpenVideo}
              onOpenMedia={handleOpenMedia}
              onToggleHidden={handleToggleHidden}
              showMedia={showMedia}
              onToggleMediaVisibility={handleToggleMediaVisibility}
              onOpenCompareHistoryModal={handleOpenCompareHistoryModal}
              onTranslate={handleTranslate}
            />
            <StatusActionBar
              status={actualStatus}
              onDelete={onDeleteStatus}
            />
          </div>
        </HotKeys>
      </div>
      {
        me && <>
          <hr className='my-5 border-gray-200 dark:border-gray-700' />
          <div className='py-4'>
            <ComposeFormContainer autoFocus={false} onSubmit={handleComposeSubmit} />
          </div>
        </>
      }

    </>
  ), [actualStatus, handlers, intl, handleOpenVideo, handleOpenMedia, handleToggleHidden, showMedia, handleToggleMediaVisibility, handleOpenCompareHistoryModal, handleTranslate, me, handleComposeSubmit]);


  const children = useMemo(() => {
    const childs: JSX.Element[] = [];
    if (hasAncestors) {
      childs.push(...renderChildren(ancestorsIds).toArray());
    }
    childs.push(focusedStatus);
    if (hasDescendants) {
      childs.push(...renderChildren(descendantsIds).toArray());
    }
    return childs;
  }, [ancestorsIds, descendantsIds, focusedStatus, hasAncestors, hasDescendants, renderChildren]);


  if (!actualStatus && isLoaded) {
    return (
      <MissingIndicator />
    );
  } else if (!actualStatus) {
    return (
      <PlaceholderStatus />
    );
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
              placeholderComponent={() => <PlaceholderStatus />}
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

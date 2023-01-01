import classNames from 'classnames';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
} from 'immutable';
import escape from 'lodash/escape';
import throttle from 'lodash/throttle';
import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { createSelector } from 'reselect';

import { fetchChatMessages, deleteChatMessage } from 'soapbox/actions/chats';
import { openModal } from 'soapbox/actions/modals';
import { initReportById } from 'soapbox/actions/reports';
import { Text } from 'soapbox/components/ui';
import DropdownMenuContainer from 'soapbox/containers/dropdown_menu_container';
import emojify from 'soapbox/features/emoji/emoji';
import Bundle from 'soapbox/features/ui/components/bundle';
import { MediaGallery } from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useAppDispatch, useRefEventHandler } from 'soapbox/hooks';
import { onlyEmoji } from 'soapbox/utils/rich_content';

import type { Menu } from 'soapbox/components/dropdown_menu';
import type { ChatMessage as ChatMessageEntity } from 'soapbox/types/entities';

const BIG_EMOJI_LIMIT = 1;

const messages = defineMessages({
  today: { id: 'chats.dividers.today', defaultMessage: 'Today' },
  more: { id: 'chats.actions.more', defaultMessage: 'More' },
  delete: { id: 'chats.actions.delete', defaultMessage: 'Delete message' },
  report: { id: 'chats.actions.report', defaultMessage: 'Report user' },
});

type TimeFormat = 'today' | 'date';

const timeChange = (prev: ChatMessageEntity, curr: ChatMessageEntity): TimeFormat | null => {
  const prevDate = new Date(prev.created_at).getDate();
  const currDate = new Date(curr.created_at).getDate();
  const nowDate  = new Date().getDate();

  if (prevDate !== currDate) {
    return currDate === nowDate ? 'today' : 'date';
  }

  return null;
};

const makeEmojiMap = (record: any) => record.get('emojis', ImmutableList()).reduce((map: ImmutableMap<string, any>, emoji: ImmutableMap<string, any>) => {
  return map.set(`:${emoji.get('shortcode')}:`, emoji);
}, ImmutableMap());

const getChatMessages = createSelector(
  [(chatMessages: ImmutableMap<string, ChatMessageEntity>, chatMessageIds: ImmutableOrderedSet<string>) => (
    chatMessageIds.reduce((acc, curr) => {
      const chatMessage = chatMessages.get(curr);
      return chatMessage ? acc.push(chatMessage) : acc;
    }, ImmutableList<ChatMessageEntity>())
  )],
  chatMessages => chatMessages,
);

interface IChatMessageList {
  /** Chat the messages are being rendered from. */
  chatId: string,
  /** Message IDs to render. */
  chatMessageIds: ImmutableOrderedSet<string>,
}

/** Scrollable list of chat messages. */
const ChatMessageList: React.FC<IChatMessageList> = ({ chatId, chatMessageIds, autosize }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const me = useAppSelector(state => state.me);
  const chatMessages = useAppSelector(state => getChatMessages(state.chat_messages, chatMessageIds));

  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const node = useRef<HTMLDivElement>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const lastComputedScroll = useRef<number | undefined>(undefined);
  const scrollBottom = useRef<number | undefined>(undefined);

  const initialCount = useMemo(() => chatMessages.count(), []);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView(false);
  };

  const getFormattedTimestamp = (chatMessage: ChatMessageEntity) => {
    return intl.formatDate(
      new Date(chatMessage.created_at), {
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  };

  const setBubbleRef = (c: HTMLDivElement) => {
    if (!c) return;
    const links = c.querySelectorAll('a[rel="ugc"]');

    links.forEach(link => {
      link.classList.add('chat-link');
      link.setAttribute('rel', 'ugc nofollow noopener');
      link.setAttribute('target', '_blank');
    });

    if (onlyEmoji(c, BIG_EMOJI_LIMIT, false)) {
      c.classList.add('chat-message__bubble--onlyEmoji');
    } else {
      c.classList.remove('chat-message__bubble--onlyEmoji');
    }
  };

  const isNearBottom = (): boolean => {
    const elem = node.current;
    if (!elem) return false;

    const scrollBottom = elem.scrollHeight - elem.offsetHeight - elem.scrollTop;
    return scrollBottom < elem.offsetHeight * 1.5;
  };

  const handleResize = throttle(() => {
    if (isNearBottom()) {
      scrollToBottom();
    }
  }, 150);

  const restoreScrollPosition = () => {
    if (node.current && scrollBottom.current) {
      lastComputedScroll.current = node.current.scrollHeight - scrollBottom.current;
      node.current.scrollTop = lastComputedScroll.current;
    }
  };

  const handleLoadMore = () => {
    const maxId = chatMessages.getIn([0, 'id']) as string;
    dispatch(fetchChatMessages(chatId, maxId as any));
    setIsLoading(true);
  };

  const handleScroll = useRefEventHandler(throttle(() => {
    if (node.current) {
      const { scrollTop, offsetHeight } = node.current;
      const computedScroll = lastComputedScroll.current === scrollTop;
      const nearTop = scrollTop < offsetHeight * 2;

      if (nearTop && !isLoading && !initialLoad && !computedScroll) {
        handleLoadMore();
      }
    }
  }, 150, {
    trailing: true,
  }));

  const onOpenMedia = (media: any, index: number) => {
    dispatch(openModal('MEDIA', { media, index }));
  };

  const maybeRenderMedia = (chatMessage: ChatMessageEntity) => {
    const { attachment } = chatMessage;
    if (!attachment) return null;
    return (
      <div className='chat-message__media'>
        <Bundle fetchComponent={MediaGallery}>
          {(Component: any) => (
            <Component
              media={ImmutableList([attachment])}
              height={120}
              onOpenMedia={onOpenMedia}
            />
          )}
        </Bundle>
      </div>
    );
  };

  const parsePendingContent = (content: string) => {
    return escape(content).replace(/(?:\r\n|\r|\n)/g, '<br>');
  };

  const parseContent = (chatMessage: ChatMessageEntity) => {
    const content = chatMessage.content || '';
    const pending = chatMessage.pending;
    const deleting = chatMessage.deleting;
    const formatted = (pending && !deleting) ? parsePendingContent(content) : content;
    const emojiMap = makeEmojiMap(chatMessage);
    return emojify(formatted, emojiMap.toJS());
  };

  const renderDivider = (key: React.Key, text: string) => (
    <div className='chat-messages__divider' key={key}>{text}</div>
  );

  const handleDeleteMessage = (chatId: string, messageId: string) => {
    return () => {
      dispatch(deleteChatMessage(chatId, messageId));
    };
  };

  const handleReportUser = (userId: string) => {
    return () => {
      dispatch(initReportById(userId));
    };
  };

  const renderMessage = (chatMessage: ChatMessageEntity) => {
    const menu: Menu = [
      {
        text: intl.formatMessage(messages.delete),
        action: handleDeleteMessage(chatMessage.chat_id, chatMessage.id),
        icon: require('@tabler/icons/trash.svg'),
        destructive: true,
      },
    ];

    if (chatMessage.account_id !== me) {
      menu.push({
        text: intl.formatMessage(messages.report),
        action: handleReportUser(chatMessage.account_id),
        icon: require('@tabler/icons/flag.svg'),
      });
    }

    return (
      <div
        className={classNames('chat-message', {
          'chat-message--me': chatMessage.account_id === me,
          'chat-message--pending': chatMessage.pending,
        })}
        key={chatMessage.id}
      >
        <div
          title={getFormattedTimestamp(chatMessage)}
          className='chat-message__bubble'
          ref={setBubbleRef}
          tabIndex={0}
        >
          {maybeRenderMedia(chatMessage)}
          <Text size='sm' dangerouslySetInnerHTML={{ __html: parseContent(chatMessage) }} />
          <div className='chat-message__menu'>
            <DropdownMenuContainer
              items={menu}
              src={require('@tabler/icons/dots.svg')}
              title={intl.formatMessage(messages.more)}
            />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(fetchChatMessages(chatId));

    node.current?.addEventListener('scroll', e => handleScroll.current(e));
    window.addEventListener('resize', handleResize);
    scrollToBottom();

    return () => {
      node.current?.removeEventListener('scroll', e => handleScroll.current(e));
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Store the scroll position.
  useLayoutEffect(() => {
    if (node.current) {
      const { scrollHeight, scrollTop } = node.current;
      scrollBottom.current = scrollHeight - scrollTop;
    }
  });

  // Stick scrollbar to bottom.
  useEffect(() => {
    if (isNearBottom()) {
      scrollToBottom();
    }

    // First load.
    if (chatMessages.count() !== initialCount) {
      setInitialLoad(false);
      setIsLoading(false);
      scrollToBottom();
    }
  }, [chatMessages.count()]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesEnd.current]);

  // History added.
  useEffect(() => {
    // Restore scroll bar position when loading old messages.
    if (!initialLoad) {
      restoreScrollPosition();
    }
  }, [chatMessageIds.first()]);

  return (
    <div className='chat-messages' ref={node}>
      {chatMessages.reduce((acc, curr, idx) => {
        const lastMessage = chatMessages.get(idx - 1);

        if (lastMessage) {
          const key = `${curr.id}_divider`;
          switch (timeChange(lastMessage, curr)) {
            case 'today':
              acc.push(renderDivider(key, intl.formatMessage(messages.today)));
              break;
            case 'date':
              acc.push(renderDivider(key, new Date(curr.created_at).toDateString()));
              break;
          }
        }

        acc.push(renderMessage(curr));
        return acc;
      }, [] as React.ReactNode[])}
      <div style={{ float: 'left', clear: 'both' }} ref={messagesEnd} />
    </div>
  );
};

export default ChatMessageList;

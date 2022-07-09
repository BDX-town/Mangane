import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import {
  closeChat,
  toggleChat,
} from 'soapbox/actions/chats';
import Avatar from 'soapbox/components/avatar';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import IconButton from 'soapbox/components/icon_button';
import { HStack, Counter } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetChat } from 'soapbox/selectors';
import { getAcct } from 'soapbox/utils/accounts';
import { displayFqn as getDisplayFqn } from 'soapbox/utils/state';

import ChatBox from './chat-box';

import type { Account as AccountEntity } from 'soapbox/types/entities';

type WindowState = 'open' | 'minimized';

const getChat = makeGetChat();

interface IChatWindow {
  /** Position of the chat window on the screen, where 0 is rightmost. */
  idx: number,
  /** ID of the chat entity. */
  chatId: string,
  /** Whether the window is open or minimized. */
  windowState: WindowState,
}

/** Floating desktop chat window. */
const ChatWindow: React.FC<IChatWindow> = ({ idx, chatId, windowState }) => {
  const dispatch = useAppDispatch();

  const displayFqn = useAppSelector(getDisplayFqn);

  const chat = useAppSelector(state => {
    const chat = state.chats.items.get(chatId);
    return chat ? getChat(state, chat.toJS() as any) : undefined;
  });

  const inputElem = useRef<HTMLTextAreaElement | null>(null);

  const handleChatClose = (chatId: string) => {
    return () => {
      dispatch(closeChat(chatId));
    };
  };

  const handleChatToggle = (chatId: string) => {
    return () => {
      dispatch(toggleChat(chatId));
    };
  };

  const handleInputRef = (el: HTMLTextAreaElement) => {
    inputElem.current = el;
  };

  const focusInput = () => {
    inputElem.current?.focus();
  };

  useEffect(() => {
    if (windowState === 'open') {
      focusInput();
    }
  }, [windowState]);

  if (!chat) return null;
  const account = chat.account as unknown as AccountEntity;

  const right = (285 * (idx + 1)) + 20;
  const unreadCount = chat.unread;

  const unreadIcon = (
    <div className='mr-2 flex-none'>
      <Counter count={unreadCount} />
    </div>
  );

  const avatar = (
    <HoverRefWrapper accountId={account.id}>
      <Link to={`/@${account.acct}`}>
        <Avatar account={account} size={18} />
      </Link>
    </HoverRefWrapper>
  );

  return (
    <div className={`pane pane--${windowState}`} style={{ right: `${right}px` }}>
      <HStack space={2} className='pane__header'>
        {unreadCount > 0 ? unreadIcon : avatar }
        <button className='pane__title' onClick={handleChatToggle(chat.id)}>
          @{getAcct(account, displayFqn)}
        </button>
        <div className='pane__close'>
          <IconButton src={require('@tabler/icons/x.svg')} title='Close chat' onClick={handleChatClose(chat.id)} />
        </div>
      </HStack>
      <div className='pane__content'>
        <ChatBox
          chatId={chat.id}
          onSetInputRef={handleInputRef}
        />
      </div>
    </div>
  );
};

export default ChatWindow;

import { Map as ImmutableMap } from 'immutable';
import React, { useEffect, useRef } from 'react';

import { fetchChat, markChatRead } from 'soapbox/actions/chats';
import { Column } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetChat } from 'soapbox/selectors';
import { getAcct } from 'soapbox/utils/accounts';
import { displayFqn as getDisplayFqn } from 'soapbox/utils/state';

import ChatBox from './components/chat-box';

const getChat = makeGetChat();

interface IChatRoom {
  params: {
    chatId: string,
  }
}

/** Fullscreen chat UI. */
const ChatRoom: React.FC<IChatRoom> = ({ params }) => {
  const dispatch = useAppDispatch();
  const displayFqn = useAppSelector(getDisplayFqn);
  const inputElem = useRef<HTMLTextAreaElement | null>(null);

  const chat = useAppSelector(state => {
    const chat = state.chats.items.get(params.chatId, ImmutableMap()).toJS() as any;
    return getChat(state, chat);
  });

  const focusInput = () => {
    inputElem.current?.focus();
  };

  const handleInputRef = (el: HTMLTextAreaElement) => {
    inputElem.current = el;
    focusInput();
  };

  const markRead = () => {
    if (!chat) return;
    dispatch(markChatRead(chat.id));
  };

  useEffect(() => {
    dispatch(fetchChat(params.chatId));
    markRead();
  }, [params.chatId]);

  // If this component is loaded at all, we can instantly mark new messages as read.
  useEffect(() => {
    markRead();
  }, [chat?.unread]);

  if (!chat) return null;

  return (
    <Column label={`@${getAcct(chat.account as any, displayFqn)}`}>
      <ChatBox
        chatId={chat.id}
        onSetInputRef={handleInputRef}
        autosize
      />
    </Column>
  );
};

export default ChatRoom;

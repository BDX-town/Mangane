import React from 'react';
import { useHistory } from 'react-router-dom';

import { markConversationRead } from 'soapbox/actions/conversations';
import StatusContainer from 'soapbox/containers/status_container';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

interface IConversation {
  conversationId: string,
  onMoveUp: (id: string) => void,
  onMoveDown: (id: string) => void,
}

const Conversation: React.FC<IConversation> = ({ conversationId, onMoveUp, onMoveDown }) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { accounts, unread, lastStatusId } = useAppSelector((state) => {
    const conversation = state.conversations.items.find(x => x.id === conversationId)!;

    return {
      accounts: conversation.accounts.map((accountId: string) => state.accounts.get(accountId, null)!),
      unread: conversation.unread,
      lastStatusId: conversation.last_status || null,
    };
  });

  const handleClick = () => {
    if (unread) {
      dispatch(markConversationRead(conversationId));
    }

    history.push(`/statuses/${lastStatusId}`);
  };

  const handleHotkeyMoveUp = () => {
    onMoveUp(conversationId);
  };

  const handleHotkeyMoveDown = () => {
    onMoveDown(conversationId);
  };

  if (lastStatusId === null) {
    return null;
  }

  return (
    // @ts-ignore
    <StatusContainer
      id={lastStatusId}
      unread={unread}
      otherAccounts={accounts}
      onMoveUp={handleHotkeyMoveUp}
      onMoveDown={handleHotkeyMoveDown}
      onClick={handleClick}
    />
  );
};

export default Conversation;

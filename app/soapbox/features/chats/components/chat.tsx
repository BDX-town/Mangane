import React from 'react';
import { FormattedMessage } from 'react-intl';

import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetChat } from 'soapbox/selectors';
import { shortNumberFormat } from 'soapbox/utils/numbers';

import type { Account as AccountEntity, Chat as ChatEntity } from 'soapbox/types/entities';

const getChat = makeGetChat();

interface IChat {
  chatId: string,
  onClick: (chat: any) => void,
}

const Chat: React.FC<IChat> = ({ chatId, onClick }) => {
  const chat = useAppSelector((state) => {
    const chat = state.chats.getIn(['items', chatId]);
    return chat ? getChat(state, (chat as any).toJS()) : undefined;
  }) as ChatEntity;

  const account = chat.account as AccountEntity;
  if (!chat || !account) return null;
  const unreadCount = chat.unread;
  const content = chat.getIn(['last_message', 'content']);
  const attachment = chat.getIn(['last_message', 'attachment']);
  const image = attachment && (attachment as any).getIn(['pleroma', 'mime_type'], '').startsWith('image/');
  const parsedContent = content ? emojify(content) : '';

  return (
    <div className='account'>
      <button className='floating-link' onClick={() => onClick(chat)} />
      <div className='account__wrapper'>
        <div key={account.id} className='account__display-name'>
          <div className='account__avatar-wrapper'>
            <Avatar account={account} size={36} />
          </div>
          <DisplayName account={account} />
          {attachment && (
            <Icon
              className='chat__attachment-icon'
              src={image ? require('@tabler/icons/icons/photo.svg') : require('@tabler/icons/icons/paperclip.svg')}
            />
          )}
          {content ? (
            <span
              className='chat__last-message'
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : attachment && (
            <span
              className='chat__last-message attachment'
            >
              {image ? <FormattedMessage id='chats.attachment_image' defaultMessage='Image' /> : <FormattedMessage id='chats.attachment' defaultMessage='Attachment' />}
            </span>
          )}
          {unreadCount > 0 && <i className='icon-with-badge__badge'>{shortNumberFormat(unreadCount)}</i>}
        </div>
      </div>
    </div>
  );
};

export default Chat;

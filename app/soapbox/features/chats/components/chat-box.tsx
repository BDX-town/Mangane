import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import React, { useRef, useState } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import {
  sendChatMessage,
  markChatRead,
} from 'soapbox/actions/chats';
import { uploadMedia } from 'soapbox/actions/media';
import { IconButton } from 'soapbox/components/ui';
import UploadProgress from 'soapbox/components/upload-progress';
import EmojiPickerDropdown from 'soapbox/containers/emoji_picker_dropdown_container';
import UploadButton from 'soapbox/features/compose/components/upload_button';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { truncateFilename } from 'soapbox/utils/media';

import ChatMessageList from './chat-message-list';

const messages = defineMessages({
  placeholder: { id: 'chat_box.input.placeholder', defaultMessage: 'Send a message…' },
  send: { id: 'chat_box.actions.send', defaultMessage: 'Send' },
});

const fileKeyGen = (): number => Math.floor((Math.random() * 0x10000));

interface IChatBox {
  chatId: string,
  onSetInputRef: (el: HTMLTextAreaElement) => void,
  autosize?: boolean,
}

/**
 * Chat UI with just the messages and textarea.
 * Reused between floating desktop chats and fullscreen/mobile chats.
 */
const ChatBox: React.FC<IChatBox> = ({ chatId, onSetInputRef, autosize }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const chatMessageIds = useAppSelector(state => state.chat_message_lists.get(chatId, ImmutableOrderedSet<string>()));

  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<any>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resetFileKey, setResetFileKey] = useState<number>(fileKeyGen());

  const inputElem = useRef<HTMLTextAreaElement | null>(null);

  const clearState = () => {
    setContent('');
    setAttachment(undefined);
    setIsUploading(false);
    setUploadProgress(0);
    setResetFileKey(fileKeyGen());
  };

  const getParams = () => {
    return {
      content,
      media_id: attachment && attachment.id,
    };
  };

  const canSubmit = () => {
    const conds = [
      content.length > 0,
      attachment,
    ];

    return conds.some(c => c);
  };

  const sendMessage = () => {
    if (canSubmit() && !isUploading) {
      const params = getParams();

      dispatch(sendChatMessage(chatId, params));
      clearState();
    }
  };

  const insertLine = () => {
    setContent(content + '\n');
  };

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    markRead();
    if (e.key === 'Enter' && e.shiftKey) {
      insertLine();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      sendMessage();
      e.preventDefault();
    }
  };

  const handleContentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };

  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (!canSubmit() && e.clipboardData && e.clipboardData.files.length === 1) {
      handleFiles(e.clipboardData.files);
    }
  };

  const markRead = () => {
    dispatch(markChatRead(chatId));
  };

  const handleHover = () => {
    markRead();
  };

  const setInputRef = (el: HTMLTextAreaElement) => {
    inputElem.current = el;
    onSetInputRef(el);
  };

  const handleRemoveFile = () => {
    setAttachment(undefined);
    setResetFileKey(fileKeyGen());
  };

  const onUploadProgress = (e: ProgressEvent) => {
    const { loaded, total } = e;
    setUploadProgress(loaded / total);
  };

  const handleFiles = (files: FileList) => {
    setIsUploading(true);

    const data = new FormData();
    data.append('file', files[0]);

    dispatch(uploadMedia(data, onUploadProgress)).then((response: any) => {
      setAttachment(response.data);
      setIsUploading(false);
    }).catch(() => {
      setIsUploading(false);
    });
  };

  const handleEmojiPick = React.useCallback((data) => {
    if (data.custom) {
      setContent(content + ' ' + data.native + ' ');
    } else {
      setContent(content + data.native);
    }
  }, [content]);

  const renderAttachment = () => {
    if (!attachment) return null;

    return (
      <div className='chat-box__attachment'>
        <div className='chat-box__filename'>
          {truncateFilename(attachment.preview_url, 20)}
        </div>
        <div className='chat-box__remove-attachment'>
          <IconButton
            src={require('@tabler/icons/x.svg')}
            onClick={handleRemoveFile}
          />
        </div>
      </div>
    );
  };

  if (!chatMessageIds) return null;

  return (
    <div className='chat-box' onMouseOver={handleHover}>
      <ChatMessageList chatMessageIds={chatMessageIds} chatId={chatId} />
      <div className='chat-box__actions'>
        <div>
          {renderAttachment()}
          {isUploading && (
            <UploadProgress progress={uploadProgress * 100} />
          )}
        </div>
        <div className='flex items-center gap-2'>
          <textarea
            className='border'
            rows={1}
            placeholder={intl.formatMessage(messages.placeholder)}
            onKeyDown={handleKeyDown}
            onChange={handleContentChange}
            onPaste={handlePaste}
            value={content}
            ref={setInputRef}
          />
          <div className='chat-box__send flex items-center gap-1'>
            <EmojiPickerDropdown
              onPickEmoji={handleEmojiPick}
            />
            {
              canSubmit() ? (
                <IconButton
                  className='text-gray-400 hover:text-gray-600'
                  src={require('@tabler/icons/send.svg')}
                  title={intl.formatMessage(messages.send)}
                  onClick={sendMessage}
                />
              ) : (
                <UploadButton onSelectFile={handleFiles} resetFileKey={resetFileKey} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

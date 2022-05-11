import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import {
  sendChatMessage,
  markChatRead,
} from 'soapbox/actions/chats';
import { uploadMedia } from 'soapbox/actions/media';
import IconButton from 'soapbox/components/icon_button';
import UploadProgress from 'soapbox/features/compose/components/upload-progress';
import UploadButton from 'soapbox/features/compose/components/upload_button';
import { truncateFilename } from 'soapbox/utils/media';

import ChatMessageList from './chat_message_list';

const messages = defineMessages({
  placeholder: { id: 'chat_box.input.placeholder', defaultMessage: 'Send a message…' },
  send: { id: 'chat_box.actions.send', defaultMessage: 'Send' },
});

const mapStateToProps = (state, { chatId }) => ({
  me: state.get('me'),
  chat: state.getIn(['chats', 'items', chatId]),
  chatMessageIds: state.getIn(['chat_message_lists', chatId], ImmutableOrderedSet()),
});

const fileKeyGen = () => Math.floor((Math.random() * 0x10000));

export default @connect(mapStateToProps)
@injectIntl
class ChatBox extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chatId: PropTypes.string.isRequired,
    chatMessageIds: ImmutablePropTypes.orderedSet,
    chat: ImmutablePropTypes.record,
    onSetInputRef: PropTypes.func,
    me: PropTypes.node,
  }

  initialState = () => ({
    content: '',
    attachment: undefined,
    isUploading: false,
    uploadProgress: 0,
    resetFileKey: fileKeyGen(),
  })

  state = this.initialState()

  clearState = () => {
    this.setState(this.initialState());
  }

  getParams = () => {
    const { content, attachment } = this.state;

    return {
      content,
      media_id: attachment && attachment.id,
    };
  }

  canSubmit = () => {
    const { content, attachment } = this.state;

    const conds = [
      content.length > 0,
      attachment,
    ];

    return conds.some(c => c);
  }

  sendMessage = () => {
    const { dispatch, chatId } = this.props;
    const { isUploading } = this.state;

    if (this.canSubmit() && !isUploading) {
      const params = this.getParams();

      dispatch(sendChatMessage(chatId, params));
      this.clearState();
    }
  }

  insertLine = () => {
    const { content } = this.state;
    this.setState({ content: content + '\n' });
  }

  handleKeyDown = (e) => {
    this.markRead();
    if (e.key === 'Enter' && e.shiftKey) {
      this.insertLine();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      this.sendMessage();
      e.preventDefault();
    }
  }

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  }

  markRead = () => {
    const { dispatch, chatId } = this.props;
    dispatch(markChatRead(chatId));
  }

  handleHover = () => {
    this.markRead();
  }

  setInputRef = (el) => {
    const { onSetInputRef } = this.props;
    this.inputElem = el;
    onSetInputRef(el);
  };

  handleRemoveFile = (e) => {
    this.setState({ attachment: undefined, resetFileKey: fileKeyGen() });
  }

  onUploadProgress = (e) => {
    const { loaded, total } = e;
    this.setState({ uploadProgress: loaded / total });
  }

  handleFiles = (files) => {
    const { dispatch } = this.props;

    this.setState({ isUploading: true });

    const data = new FormData();
    data.append('file', files[0]);

    dispatch(uploadMedia(data, this.onUploadProgress)).then(response => {
      this.setState({ attachment: response.data, isUploading: false });
    }).catch(() => {
      this.setState({ isUploading: false });
    });
  }

  renderAttachment = () => {
    const { attachment } = this.state;
    if (!attachment) return null;

    return (
      <div className='chat-box__attachment'>
        <div className='chat-box__filename'>
          {truncateFilename(attachment.preview_url, 20)}
        </div>
        <div class='chat-box__remove-attachment'>
          <IconButton
            src={require('@tabler/icons/icons/x.svg')}
            onClick={this.handleRemoveFile}
          />
        </div>
      </div>
    );
  }

  renderActionButton = () => {
    const { intl } = this.props;
    const { resetFileKey } = this.state;

    return this.canSubmit() ? (
      <IconButton
        src={require('@tabler/icons/icons/send.svg')}
        title={intl.formatMessage(messages.send)}
        onClick={this.sendMessage}
      />
    ) : (
      <UploadButton onSelectFile={this.handleFiles} resetFileKey={resetFileKey} />
    );
  }

  render() {
    const { chatMessageIds, chatId, intl } = this.props;
    const { content, isUploading, uploadProgress } = this.state;
    if (!chatMessageIds) return null;

    return (
      <div className='chat-box' onMouseOver={this.handleHover}>
        <ChatMessageList chatMessageIds={chatMessageIds} chatId={chatId} />
        {this.renderAttachment()}
        <UploadProgress active={isUploading} progress={uploadProgress * 100} />
        <div className='chat-box__actions simple_form'>
          <div className='chat-box__send'>
            {this.renderActionButton()}
          </div>
          <textarea
            rows={1}
            placeholder={intl.formatMessage(messages.placeholder)}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleContentChange}
            value={content}
            ref={this.setInputRef}
          />
        </div>
      </div>
    );
  }

}

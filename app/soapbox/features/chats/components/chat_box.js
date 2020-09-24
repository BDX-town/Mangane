import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import {
  sendChatMessage,
  markChatRead,
} from 'soapbox/actions/chats';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import ChatMessageList from './chat_message_list';
import UploadButton from 'soapbox/features/compose/components/upload_button';
import { uploadMedia } from 'soapbox/actions/media';
import UploadProgress from 'soapbox/features/compose/components/upload_progress';
import { truncateFilename } from 'soapbox/utils/media';
import IconButton from 'soapbox/components/icon_button';
import UploadArea from 'soapbox/features/ui/components/upload_area';

const messages = defineMessages({
  placeholder: { id: 'chat_box.input.placeholder', defaultMessage: 'Send a message…' },
});

const mapStateToProps = (state, { chatId }) => ({
  me: state.get('me'),
  chat: state.getIn(['chats', chatId]),
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
    chat: ImmutablePropTypes.map,
    onSetInputRef: PropTypes.func,
    me: PropTypes.node,
    onAttachment: PropTypes.func,
    windowState: PropTypes.string,
  }

  initialState = () => ({
    content: '',
    attachment: undefined,
    isUploading: false,
    uploadProgress: 0,
    resetFileKey: fileKeyGen(),
    draggingOver: false,
  })

  state = this.initialState()

  componentDidMount() {
    this.node.addEventListener('dragenter', this.handleDragEnter, false);
    this.node.addEventListener('dragover', this.handleDragOver, false);
    this.node.addEventListener('drop', this.handleDrop, false);
    this.node.addEventListener('dragleave', this.handleDragLeave, false);
    this.node.addEventListener('dragend', this.handleDragEnd, false);
  }

  componentWillUnmount() {
    this.node.removeEventListener('dragenter', this.handleDragEnter);
    this.node.removeEventListener('dragover', this.handleDragOver);
    this.node.removeEventListener('drop', this.handleDrop);
    this.node.removeEventListener('dragleave', this.handleDragLeave);
    this.node.removeEventListener('dragend', this.handleDragEnd);
  }

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
    onSetInputRef(el);
  };

  setRef = c => {
    this.node = c;
  }

  handleAttachment = () => {
    const { onAttachment } = this.props;
    onAttachment(true);
  }

  handleRemoveFile = (e) => {
    this.setState({ attachment: undefined, resetFileKey: fileKeyGen() });
  }

  dataTransferIsText = (dataTransfer) => {
    return (dataTransfer && Array.from(dataTransfer.types).includes('text/plain') && dataTransfer.items.length === 1);
  }

  handleDragEnter = (e) => {
    e.preventDefault();

    if (!this.dragTargets) {
      this.dragTargets = [];
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target);
    }

    if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
      this.setState({ draggingOver: true });
    }
  }

  handleDragOver = (e) => {
    if (this.dataTransferIsText(e.dataTransfer)) return false;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.dataTransfer.dropEffect = 'copy';
    } catch (err) {

    }

    return false;
  }

  handleDrop = (e) => {
    const { me } = this.props;
    if (!me) return;

    if (this.dataTransferIsText(e.dataTransfer)) return;
    e.preventDefault();

    this.setState({ draggingOver: false });
    this.dragTargets = [];

    if (e.dataTransfer && e.dataTransfer.files.length >= 1) {
      this.handleFiles(e.dataTransfer.files);
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.node.contains(el));

    if (this.dragTargets.length > 0) {
      return;
    }

    this.setState({ draggingOver: false });
  }

  closeUploadModal = () => {
    this.setState({ draggingOver: false });
  }

  onUploadProgress = (e) => {
    const { loaded, total } = e;
    this.setState({ uploadProgress: loaded/total });
  }

  handleFiles = (files) => {
    const { dispatch } = this.props;

    this.setState({ isUploading: true });

    const data = new FormData();
    data.append('file', files[0]);

    dispatch(uploadMedia(data, this.onUploadProgress)).then(response => {
      this.setState({ attachment: response.data, isUploading: false });
      this.handleAttachment();
    }).catch(() => {
      this.setState({ isUploading: false });
    });
  }

  renderUploadArea = () => {
    const { windowState } = this.props;
    const { draggingOver } = this.state;
    if (windowState !== 'open') return null;

    return (
      <UploadArea active={draggingOver} onClose={this.closeUploadModal} />
    );
  }

  renderAttachment = () => {
    const { attachment } = this.state;
    if (!attachment) return null;

    return (
      <div className='chat-box__attachment'>
        <div className='chat-box__filename'>
          {truncateFilename(attachment.preview_url, 20)}
        </div>
        <div className='chat-box__remove-attachment'>
          <IconButton icon='remove' title='remove' onClick={this.handleRemoveFile} />
        </div>
      </div>
    );
  }

  renderActionButton = () => {
    const { resetFileKey } = this.state;

    return this.canSubmit() ? (
      <div className='chat-box__send'>
        <IconButton icon='send' size={16} title='send' onClick={this.sendMessage} />
      </div>
    ) : (
      <UploadButton onSelectFile={this.handleFiles} resetFileKey={resetFileKey} />
    );
  }

  render() {
    const { chatMessageIds, chatId, intl, windowState } = this.props;
    const { content, isUploading, uploadProgress } = this.state;
    console.log('window state: ' + windowState + ', chatID: ' + chatId);
    if (!chatMessageIds) return null;

    return (
      <div className='chat-box' ref={this.setRef} onMouseOver={this.handleHover}>
        <ChatMessageList chatMessageIds={chatMessageIds} chatId={chatId} />
        {this.renderAttachment()}
        <UploadProgress active={isUploading} progress={uploadProgress*100} />
        {this.renderUploadArea()}
        <div className='chat-box__actions simple_form'>
          {this.renderActionButton()}
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

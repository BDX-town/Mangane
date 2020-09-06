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
import { Map as ImmutableMap } from 'immutable';
import UploadProgress from 'soapbox/features/compose/components/upload_progress';

const messages = defineMessages({
  placeholder: { id: 'chat_box.input.placeholder', defaultMessage: 'Send a message…' },
});

const mapStateToProps = (state, { chatId }) => ({
  me: state.get('me'),
  chat: state.getIn(['chats', chatId]),
  chatMessageIds: state.getIn(['chat_message_lists', chatId], ImmutableOrderedSet()),
});

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
  }

  initialParams = {
    content: '',
    media_id: undefined,
  }

  state = {
    params: ImmutableMap(this.initialParams),
    isUploading: false,
    uploadProgress: 0,
  }

  setParams = newParams => {
    const { params } = this.state;
    this.setState({ params: params.merge(newParams) });
  }

  clearParams = () => {
    this.setState({ params: ImmutableMap(this.initialParams) });
  }

  sendMessage = () => {
    const { chatId } = this.props;
    const { params, isUploading } = this.state;

    const conds = [
      params.get('content', '').length > 0,
      params.get('media_id'),
    ];

    if (!isUploading && conds.some(c => c)) {
      this.props.dispatch(sendChatMessage(chatId, params.toJS()));
      this.clearParams();
    }
  }

  insertLine = () => {
    const { params } = this.state;
    this.setParams({ content: params.get('content') + '\n' });
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      this.insertLine();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      this.sendMessage();
      e.preventDefault();
    }
  }

  handleContentChange = (e) => {
    this.setParams({ content: e.target.value });
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

  componentDidUpdate(prevProps) {
    const markReadConditions = [
      () => this.props.chat !== undefined,
      () => document.activeElement === this.inputElem,
      () => this.props.chat.get('unread') > 0,
    ];

    if (markReadConditions.every(c => c() === true))
      this.markRead();
  }

  onUploadProgress = (e) => {
    const { loaded, total } = e;
    this.setState({ uploadProgress: loaded/total });
  }

  handleFiles = (files) => {
    this.setState({ isUploading: true });
    const data = new FormData();
    data.append('file', files[0]);
    this.props.dispatch(uploadMedia(data, this.onUploadProgress)).then(response => {
      const newParams = this.state.params.merge({ media_id: response.data.id });
      this.setState({ params: newParams, isUploading: false });
    }).catch(() => {});
  }

  render() {
    const { chatMessageIds, chatId, intl } = this.props;
    const { params, isUploading, uploadProgress } = this.state;
    if (!chatMessageIds) return null;

    return (
      <div className='chat-box' onMouseOver={this.handleHover}>
        <ChatMessageList chatMessageIds={chatMessageIds} chatId={chatId} />
        <UploadProgress active={isUploading} progress={uploadProgress*100} />
        <div className='chat-box__actions simple_form'>
          <UploadButton onSelectFile={this.handleFiles} />
          <textarea
            rows={1}
            placeholder={intl.formatMessage(messages.placeholder)}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleContentChange}
            value={params.get('content', '')}
            ref={this.setInputRef}
          />
        </div>
      </div>
    );
  }

}

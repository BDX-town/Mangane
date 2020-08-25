import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { getSettings } from 'soapbox/actions/settings';
import ChatList from './chat_list';
import { FormattedMessage } from 'react-intl';
import { makeGetChat } from 'soapbox/selectors';
// import { fromJS } from 'immutable';

const addChatsToPanes = (state, panesData) => {
  const getChat = makeGetChat();

  const newPanes = panesData.get('panes').map(pane => {
    const chat = getChat(state, { id: pane.get('chat_id') });
    return pane.set('chat', chat);
  });

  return panesData.set('panes', newPanes);
};

const mapStateToProps = state => {
  const panesData = getSettings(state).get('chats');

  // const panesData = fromJS({
  //   panes: [
  //     { chat_id: '9ySohyWw0Gecd3WHKK', state: 'open' },
  //   ],
  // });

  return {
    panesData: addChatsToPanes(state, panesData),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ChatPanes extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    panesData: ImmutablePropTypes.map,
  }

  renderChatPane = (pane, i) => {
    const chat = pane.get('chat');
    if (!chat) return null;

    return (
      <div key={i} className='pane'>
        <div className='pane__header'>
          {chat.getIn(['account', 'acct'])}
        </div>
        <div className='pane__content'>
          // TODO: Show the chat messages
          <div className='pane__actions'>
            <input type='text' />
          </div>
        </div>
      </div>
    );
  }

  renderChatPanes = (panes) => (
    panes.map((pane, i) =>
      this.renderChatPane(pane, i)
    )
  )

  render() {
    const panes = this.props.panesData.get('panes');

    return (
      <div className='chat-panes'>
        <div className='pane pane--main'>
          <div className='pane__header'>
            <FormattedMessage id='chat_panels.main_window.title' defaultMessage='Chats' />
          </div>
          <div className='pane__content'>
            <ChatList />
          </div>
        </div>
        {this.renderChatPanes(panes)}
      </div>
    );
  }

}

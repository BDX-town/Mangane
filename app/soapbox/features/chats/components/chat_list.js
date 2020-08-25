import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { fetchChats } from 'soapbox/actions/chats';
import Account from 'soapbox/components/account';

const mapStateToProps = state => ({
  chats: state.get('chats'),
});

export default @connect(mapStateToProps)
@injectIntl
class ChatList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchChats());
  }

  render() {
    const { chats } = this.props;

    return (
      <div className='chat-list'>
        <div className='chat-list__header'>
          <FormattedMessage id='chat_list.title' defaultMessage='Chats' />
        </div>
        <div className='chat-list__content'>
          {chats.toList().map(chat => (
            <div className='chat-list-item'>
              <Account account={chat.get('account')} />
            </div>
          ))}
        </div>
      </div>
    );
  }

}

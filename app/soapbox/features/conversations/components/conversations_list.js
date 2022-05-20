import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import ScrollableList from '../../../components/scrollable_list';
import ConversationContainer from '../containers/conversation_container';

export default class ConversationsList extends ImmutablePureComponent {

  static propTypes = {
    conversations: ImmutablePropTypes.list.isRequired,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    onLoadMore: PropTypes.func,
  };

  getCurrentIndex = id => this.props.conversations.findIndex(x => x.get('id') === id)

  handleMoveUp = id => {
    const elementIndex = this.getCurrentIndex(id) - 1;
    this._selectChild(elementIndex);
  }

  handleMoveDown = id => {
    const elementIndex = this.getCurrentIndex(id) + 1;
    this._selectChild(elementIndex);
  }

  _selectChild(index) {
    this.node.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const element = document.querySelector(`#direct-list [data-index="${index}"] .focusable`);

        if (element) {
          element.focus();
        }
      },
    });
  }

  setRef = c => {
    this.node = c;
  }

  handleLoadOlder = debounce(() => {
    const maxId = this.props.conversations.getIn([-1, 'id']);
    if (maxId) this.props.onLoadMore(maxId);
  }, 300, { leading: true })

  render() {
    const { conversations, isLoading, onLoadMore, ...other } = this.props;

    return (
      <ScrollableList
        {...other}
        onLoadMore={onLoadMore && this.handleLoadOlder}
        id='direct-list'
        scrollKey='direct'
        ref={this.setRef}
        isLoading={isLoading}
        showLoading={isLoading && conversations.size === 0}
      >
        {conversations.map(item => (
          <ConversationContainer
            key={item.get('id')}
            conversationId={item.get('id')}
            onMoveUp={this.handleMoveUp}
            onMoveDown={this.handleMoveDown}
          />
        ))}
      </ScrollableList>
    );
  }

}

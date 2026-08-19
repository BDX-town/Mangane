import debounce from 'lodash/debounce';
import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { expandConversations } from 'soapbox/actions/conversations';
import ScrollableList from 'soapbox/components/scrollable_list';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import scrollIntoViewAndFocus from 'soapbox/utils/scroll_into_view';

import Conversation from '../components/conversation';

const Placeholder = (props: object) => {
  return <div className='sm:pb-3'><PlaceholderStatus {...props} timeline /></div>;
};

const ConversationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLElement>(null);

  const conversations = useAppSelector((state) => state.conversations.items);
  const isLoading = useAppSelector((state) => state.conversations.isLoading);

  const getCurrentIndex = (id: string) => conversations.findIndex(x => x.id === id);

  const handleMoveUp = (id: string) => {
    const elementIndex = getCurrentIndex(id) - 1;
    selectChild(elementIndex);
  };

  const handleMoveDown = (id: string) => {
    const elementIndex = getCurrentIndex(id) + 1;
    selectChild(elementIndex);
  };

  const selectChild = (index: number) => {
    scrollIntoViewAndFocus(ref.current, index);
  };

  const handleLoadOlder = debounce(() => {
    const maxId = conversations.getIn([-1, 'id']);
    if (maxId) dispatch(expandConversations({ maxId }));
  }, 300, { leading: true });

  return (
    <ScrollableList
      onLoadMore={handleLoadOlder}
      id='direct-list'
      scrollKey='direct'
      ref={ref}
      isLoading={isLoading}
      placeholderComponent={Placeholder}
      placeholderCount={5}
      emptyMessage={<FormattedMessage id='empty_column.direct' defaultMessage="You don't have any direct messages yet. When you send or receive one, it will show up here." />}
    >
      {conversations.map((item: any, index: number) => (
        <Conversation
          className='my-3'
          key={item.id}
          conversationId={item.id}
          index={index}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      ))}
    </ScrollableList>
  );
};

export default ConversationsList;

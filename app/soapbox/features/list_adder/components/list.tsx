import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { removeFromListAdder, addToListAdder } from 'soapbox/actions/lists';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  remove: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  add: { id: 'lists.account.add', defaultMessage: 'Add to list' },
});

interface IList {
  listId: string,
}

const List: React.FC<IList> = ({ listId }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const list = useAppSelector((state) => state.lists.get(listId));
  const added = useAppSelector((state) => state.listAdder.lists.items.includes(listId));

  const onRemove = () => dispatch(removeFromListAdder(listId));
  const onAdd = () => dispatch(addToListAdder(listId));

  if (!list) return null;

  let button;

  if (added) {
    button = <IconButton iconClassName='h-5 w-5' src={require('@tabler/icons/x.svg')} title={intl.formatMessage(messages.remove)} onClick={onRemove} />;
  } else {
    button = <IconButton iconClassName='h-5 w-5' src={require('@tabler/icons/plus.svg')} title={intl.formatMessage(messages.add)} onClick={onAdd} />;
  }

  return (
    <div className='flex items-center gap-1.5 px-2 py-4 text-black dark:text-white'>
      <Icon src={require('@tabler/icons/list.svg')} fixedWidth />
      <span className='flex-grow'>
        {list.title}
      </span>
      {button}
    </div>
  );
};

export default List;

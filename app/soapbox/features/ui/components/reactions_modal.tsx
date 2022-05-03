import { List as ImmutableList } from 'immutable';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchFavourites, fetchReactions } from 'soapbox/actions/interactions';
import FilterBar from 'soapbox/components/filter_bar';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Modal, Spinner } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  all: { id: 'reactions.all', defaultMessage: 'All' },
});

interface IReactionsModal {
  onClose: (string: string) => void,
  statusId: string,
  username: string,
  reaction?: string,
}

const ReactionsModal: React.FC<IReactionsModal> = ({ onClose, statusId, ...props }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [reaction, setReaction] = useState(props.reaction);
  const reactions = useAppSelector<Array<{
    accounts: Array<string>,
    count: number,
    name: string,
  }>>((state) => {
    const favourites = state.user_lists.getIn(['favourited_by', statusId]);
    const reactions = state.user_lists.getIn(['reactions', statusId]);
    return favourites && reactions && ImmutableList(favourites ? [{ accounts: favourites, count: favourites.size, name: '👍' }] : []).concat(reactions || []);
  });

  const fetchData = () => {
    dispatch(fetchFavourites(statusId));
    dispatch(fetchReactions(statusId));
  };

  const onClickClose = () => {
    onClose('REACTIONS');
  };

  const renderFilterBar = () => {
    const items = [
      {
        text: intl.formatMessage(messages.all),
        action: () => setReaction(''),
        name: 'all',
      },
    ];

    reactions.forEach(reaction => items.push(
      {
        text: `${reaction.name} ${reaction.count}`,
        action: () => setReaction(reaction.name),
        name: reaction.name,
      },
    ));

    return <FilterBar className='reaction__filter-bar' items={items} active={reaction || 'all'} />;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const accounts = reactions && (reaction
    ? reactions.find(({ name }) => name === reaction)?.accounts.map(account => ({ id: account, reaction: reaction }))
    : reactions.map(({ accounts, name }) => accounts.map(account => ({ id: account, reaction: name }))).flat());

  let body;

  if (!accounts) {
    body = <Spinner />;
  } else {
    const emptyMessage = <FormattedMessage id='status.reactions.empty' defaultMessage='No one has reacted to this post yet. When someone does, they will show up here.' />;

    body = (<>
      {reactions.length > 0 && renderFilterBar()}
      <ScrollableList
        scrollKey='reactions'
        emptyMessage={emptyMessage}
        itemClassName='pb-3'
      >
        {accounts.map((account) =>
          <AccountContainer key={`${account.id}-${account.reaction}`} id={account.id} /* reaction={account.reaction} */ />,
        )}
      </ScrollableList>
    </>);
  }


  return (
    <Modal
      title={<FormattedMessage id='column.reactions' defaultMessage='Reactions' />}
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default ReactionsModal;

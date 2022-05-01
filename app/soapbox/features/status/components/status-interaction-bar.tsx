import classNames from 'classnames';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import React from 'react';
import { FormattedNumber } from 'react-intl';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { useAppSelector, useSoapboxConfig, useFeatures } from 'soapbox/hooks';
import { reduceEmoji } from 'soapbox/utils/emoji_reacts';

import { HStack, IconButton, Text, Emoji } from '../../../components/ui';

import type { Status } from 'soapbox/types/entities';

interface IStatusInteractionBar {
  status: Status,
}

const StatusInteractionBar: React.FC<IStatusInteractionBar> = ({ status }): JSX.Element | null => {

  const me = useAppSelector(({ me }) => me);
  const { allowedEmoji } = useSoapboxConfig();
  const dispatch = useDispatch();
  const features = useFeatures();
  const { account } = status;

  if (!account || typeof account !== 'object') return null;

  const onOpenUnauthorizedModal = () => {
    dispatch(openModal('UNAUTHORIZED'));
  };

  const onOpenReblogsModal = (username: string, statusId: string): void => {
    dispatch(openModal('REBLOGS', {
      username,
      statusId,
    }));
  };

  const onOpenFavouritesModal = (username: string, statusId: string): void => {
    dispatch(openModal('FAVOURITES', {
      username,
      statusId,
    }));
  };

  const onOpenReactionsModal = (username: string, statusId: string, reaction: string): void => {
    dispatch(openModal('REACTIONS', {
      username,
      statusId,
      reaction,
    }));
  };

  const getNormalizedReacts = () => {
    return reduceEmoji(
      ImmutableList(status.getIn(['pleroma', 'emoji_reactions']) as any),
      status.favourites_count,
      status.favourited,
      allowedEmoji,
    ).reverse();
  };

  const handleOpenReblogsModal: React.EventHandler<React.MouseEvent> = (e) => {
    e.preventDefault();

    if (!me) onOpenUnauthorizedModal();
    else onOpenReblogsModal(account.acct, status.id);
  };

  const getReposts = () => {
    if (status.reblogs_count) {
      return (
        <HStack space={0.5} alignItems='center'>
          <IconButton
            className='text-success-600 cursor-pointer'
            src={require('@tabler/icons/icons/repeat.svg')}
            role='presentation'
            onClick={handleOpenReblogsModal}
          />

          <Text theme='muted' size='sm'>
            <FormattedNumber value={status.reblogs_count} />
          </Text>
        </HStack>
      );
    }

    return '';
  };

  const handleOpenFavouritesModal: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    e.preventDefault();

    if (!me) onOpenUnauthorizedModal();
    else onOpenFavouritesModal(account.acct, status.id);
  };

  const getFavourites = () => {
    if (status.favourites_count) {
      return (
        <HStack space={0.5} alignItems='center'>
          <IconButton
            className={classNames({
              'text-accent-300': true,
              'cursor-default': !features.exposableReactions,
            })}
            src={require('@tabler/icons/icons/heart.svg')}
            iconClassName='fill-accent-300'
            role='presentation'
            onClick={features.exposableReactions ? handleOpenFavouritesModal : undefined}
          />

          <Text theme='muted' size='sm'>
            <FormattedNumber value={status.favourites_count} />
          </Text>
        </HStack>
      );
    }

    return '';
  };

  const handleOpenReactionsModal = (reaction: ImmutableMap<string, any>) => () => {
    if (!me) onOpenUnauthorizedModal();
    else onOpenReactionsModal(account.acct, status.id, String(reaction.get('name')));
  };

  const getEmojiReacts = () => {
    const emojiReacts = getNormalizedReacts();
    const count = emojiReacts.reduce((acc, cur) => (
      acc + cur.get('count')
    ), 0);

    if (count > 0) {
      return (
        <HStack space={0.5} className='emoji-reacts-container' alignItems='center'>
          <div className='emoji-reacts'>
            {emojiReacts.map((e, i) => {
              return (
                <HStack space={0.5} className='emoji-react p-1' alignItems='center' key={i}>
                  <Emoji
                    className='emoji-react__emoji w-5 h-5 flex-none'
                    emoji={e.get('name')}
                    onClick={features.exposableReactions ? handleOpenReactionsModal(e) : undefined}
                  />
                  <Text theme='muted' size='sm' className='emoji-react__count'>
                    <FormattedNumber value={e.get('count')} />
                  </Text>
                </HStack>
              );
            })}
          </div>

          <Text theme='muted' size='sm' className='emoji-reacts__count'>
            <FormattedNumber value={count} />
          </Text>
        </HStack>
      );
    }

    return '';
  };

  return (
    <HStack space={3}>
      {features.emojiReacts ? getEmojiReacts() : getFavourites()}

      {getReposts()}
    </HStack>
  );
};

export default StatusInteractionBar;

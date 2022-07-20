import classNames from 'classnames';
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactSwipeableViews from 'react-swipeable-views';
import { createSelector } from 'reselect';

import { addReaction as addReactionAction, removeReaction as removeReactionAction } from 'soapbox/actions/announcements';
import { Card, HStack, Widget } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import Announcement from './announcement';

import type { RootState } from 'soapbox/store';

const customEmojiMap = createSelector([(state: RootState) => state.custom_emojis], items => (items as ImmutableList<ImmutableMap<string, string>>).reduce((map, emoji) => map.set(emoji.get('shortcode')!, emoji), ImmutableMap<string, ImmutableMap<string, string>>()));

const AnnouncementsPanel = () => {
  const dispatch = useAppDispatch();
  const emojiMap = useAppSelector(state => customEmojiMap(state));
  const [index, setIndex] = useState(0);

  const announcements = useAppSelector((state) => state.announcements.items);

  const addReaction = (id: string, name: string) => dispatch(addReactionAction(id, name));
  const removeReaction = (id: string, name: string) => dispatch(removeReactionAction(id, name));

  if (announcements.size === 0) return null;

  const handleChangeIndex = (index: number) => {
    setIndex(index % announcements.size);
  };

  return (
    <Widget title={<FormattedMessage id='announcements.title' defaultMessage='Announcements' />}>
      <Card className='relative' size='md' variant='rounded'>
        <ReactSwipeableViews animateHeight index={index} onChangeIndex={handleChangeIndex}>
          {announcements.map((announcement) => (
            <Announcement
              key={announcement.id}
              announcement={announcement}
              emojiMap={emojiMap}
              addReaction={addReaction}
              removeReaction={removeReaction}
            />
          )).reverse()}
        </ReactSwipeableViews>
        {announcements.size > 1 && (
          <HStack space={2} alignItems='center' justifyContent='center' className='relative'>
            {announcements.map((_, i) => (
              <button
                key={i}
                tabIndex={0}
                onClick={() => setIndex(i)}
                className={classNames({
                  'w-2 h-2 rounded-full focus:ring-primary-600 focus:ring-2 focus:ring-offset-2': true,
                  'bg-gray-200 hover:bg-gray-300': i !== index,
                  'bg-primary-600': i === index,
                })}
              />
            ))}
          </HStack>
        )}
      </Card>
    </Widget>
  );
};

export default AnnouncementsPanel;

import classNames from 'classnames';
import React, { useState } from 'react';

import AnimatedNumber from 'soapbox/components/animated-number';
import unicodeMapping from 'soapbox/features/emoji/emoji_unicode_mapping_light';

import Emoji from './emoji';

import type { Map as ImmutableMap } from 'immutable';
import type { AnnouncementReaction } from 'soapbox/types/entities';

interface IReaction {
  announcementId: string;
  reaction: AnnouncementReaction;
  emojiMap: ImmutableMap<string, ImmutableMap<string, string>>;
  addReaction: (id: string, name: string) => void;
  removeReaction: (id: string, name: string) => void;
  style: React.CSSProperties;
}

const Reaction: React.FC<IReaction> = ({ announcementId, reaction, addReaction, removeReaction, emojiMap, style }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (reaction.me) {
      removeReaction(announcementId, reaction.name);
    } else {
      addReaction(announcementId, reaction.name);
    }
  };

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => setHovered(false);

  let shortCode = reaction.name;

  // @ts-ignore
  if (unicodeMapping[shortCode]) {
    // @ts-ignore
    shortCode = unicodeMapping[shortCode].shortCode;
  }

  return (
    <button
      className={classNames('flex shrink-0 items-center gap-1.5 bg-gray-100 dark:bg-primary-900 rounded-sm px-1.5 py-1 transition-colors', {
        'bg-gray-200 dark:bg-primary-800': hovered,
        'bg-primary-200 dark:bg-primary-500': reaction.me,
      })}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`:${shortCode}:`}
      style={style}
    >
      <span className='block h-4 w-4'>
        <Emoji hovered={hovered} emoji={reaction.name} emojiMap={emojiMap} />
      </span>
      <span className='block min-w-[9px] text-center text-xs font-medium text-primary-600 dark:text-white'>
        <AnimatedNumber value={reaction.count} />
      </span>
    </button>
  );
};

export default Reaction;

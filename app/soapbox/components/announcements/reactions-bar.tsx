import classNames from 'classnames';
import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

import { Icon } from 'soapbox/components/ui';
import EmojiPickerDropdown from 'soapbox/containers/emoji_picker_dropdown_container';
import { useSettings } from 'soapbox/hooks';

import Reaction from './reaction';

import type { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import type { Emoji } from 'soapbox/components/autosuggest_emoji';
import type { AnnouncementReaction } from 'soapbox/types/entities';

interface IReactionsBar {
  announcementId: string;
  reactions: ImmutableList<AnnouncementReaction>;
  emojiMap: ImmutableMap<string, ImmutableMap<string, string>>;
  addReaction: (id: string, name: string) => void;
  removeReaction: (id: string, name: string) => void;
}

const ReactionsBar: React.FC<IReactionsBar> = ({ announcementId, reactions, addReaction, removeReaction, emojiMap }) => {
  const reduceMotion = useSettings().get('reduceMotion');

  const handleEmojiPick = (data: Emoji) => {
    addReaction(announcementId, data.native.replace(/:/g, ''));
  };

  const willEnter = () => ({ scale: reduceMotion ? 1 : 0 });

  const willLeave = () => ({ scale: reduceMotion ? 0 : spring(0, { stiffness: 170, damping: 26 }) });

  const visibleReactions = reactions.filter(x => x.count > 0);

  const styles = visibleReactions.map(reaction => ({
    key: reaction.name,
    data: reaction,
    style: { scale: reduceMotion ? 1 : spring(1, { stiffness: 150, damping: 13 }) },
  })).toArray();

  return (
    <TransitionMotion styles={styles} willEnter={willEnter} willLeave={willLeave}>
      {items => (
        <div className={classNames('flex flex-wrap items-center gap-1', { 'reactions-bar--empty': visibleReactions.isEmpty() })}>
          {items.map(({ key, data, style }) => (
            <Reaction
              key={key}
              reaction={data}
              style={{ transform: `scale(${style.scale})`, position: style.scale < 0.5 ? 'absolute' : 'static' }}
              announcementId={announcementId}
              addReaction={addReaction}
              removeReaction={removeReaction}
              emojiMap={emojiMap}
            />
          ))}

          {visibleReactions.size < 8 && <EmojiPickerDropdown onPickEmoji={handleEmojiPick} button={<Icon className='h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-white' src={require('@tabler/icons/plus.svg')} />} />}
        </div>
      )}
    </TransitionMotion>
  );
};

export default ReactionsBar;

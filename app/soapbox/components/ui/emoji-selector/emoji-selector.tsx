import classNames from 'classnames';
import React from 'react';

import { Emoji, HStack } from 'soapbox/components/ui';

interface IEmojiButton {
  emoji: string,
  onClick: React.EventHandler<React.MouseEvent>,
  className?: string,
  tabIndex?: number,
}

const EmojiButton: React.FC<IEmojiButton> = ({ emoji, className, onClick, tabIndex }): JSX.Element => {
  return (
    <button className={classNames(className)} onClick={onClick} tabIndex={tabIndex}>
      <Emoji className='w-8 h-8 duration-100 hover:scale-125' emoji={emoji} />
    </button>
  );
};

interface IEmojiSelector {
  emojis: string[],
  onReact: (emoji: string) => void,
  visible?: boolean,
  focused?: boolean,
}

const EmojiSelector: React.FC<IEmojiSelector> = ({ emojis, onReact, visible = false, focused = false }): JSX.Element => {

  const handleReact = (emoji: string): React.EventHandler<React.MouseEvent> => {
    return (e) => {
      onReact(emoji);
      e.preventDefault();
      e.stopPropagation();
    };
  };

  return (
    <HStack
      space={2}
      className={classNames('bg-white dark:bg-slate-900 p-3 rounded-full shadow-md w-max')}
    >
      {emojis.map((emoji, i) => (
        <EmojiButton
          key={i}
          emoji={emoji}
          onClick={handleReact(emoji)}
          tabIndex={(visible || focused) ? 0 : -1}
        />
      ))}
    </HStack>
  );
};

export default EmojiSelector;

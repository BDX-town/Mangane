import classNames from 'classnames';
import React from 'react';

import { Emoji } from 'soapbox/components/ui';

interface IEmojiButton {
  emoji: string,
  onClick: React.EventHandler<React.MouseEvent>,
  className?: string,
  tabIndex?: number,
}

const EmojiButton: React.FC<IEmojiButton> = ({ emoji, className, onClick, tabIndex }): JSX.Element => {
  return (
    <button className={classNames(className)} onClick={onClick} tabIndex={tabIndex}>
      <Emoji className='w-8 h-8' emoji={emoji} />
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
    <div
      className={classNames('flex absolute bg-white dark:bg-slate-500 px-2 py-3 rounded-full shadow-md opacity-0 pointer-events-none duration-100 w-max', {
        'opacity-100 pointer-events-auto z-[999]': visible || focused,
      })}
    >
      {emojis.map((emoji, i) => (
        <EmojiButton
          key={i}
          emoji={emoji}
          onClick={handleReact(emoji)}
          tabIndex={(visible || focused) ? 0 : -1}
        />
      ))}
    </div>
  );
};

export default EmojiSelector;

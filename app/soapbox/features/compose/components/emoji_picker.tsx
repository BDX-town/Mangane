import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React from 'react';
import { Overlay } from 'react-overlays';

import { IconButton } from 'soapbox/components/ui';
import { isMobile } from 'soapbox/is_mobile';

import { EmojiPicker as EmojiPickerAsync } from '../../ui/util/async-components';

import EmojiPickerMenu from './emoji_picker_menu';


let EmojiPicker, Emoji; // load asynchronously


interface IWrapper {
    target: any,
    show: boolean,
    children: React.ReactNode,
}

const Wrapper: React.FC<IWrapper> = ({ target, show, children }) => {
  const placement = React.useMemo(() => target.current?.getBoundingClientRect().top * 2 < window.innerHeight ? 'bottom' : 'top', [target]);

  if (isMobile(window.innerWidth) && show) {
    return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className='fixed top-0 left-0 w-screen h-screen flex flex-col z-[200]'
      >
        { children }
      </div>
    );
  }

  return (
    <Overlay target={target.current} placement={placement} show={show}>{ children }</Overlay>
  );
};

interface IEmojiPicker {
    custom_emojis: ImmutableList<string>,
    frequentlyUsedEmojis: Array<string>,
    onPickEmoji: Function,
    onSkinTone: Function,
    skinTone: number,
    button?: React.ReactNode,
}

const EmojiPickerUI : React.FC<IEmojiPicker> = ({
  custom_emojis,
  frequentlyUsedEmojis,
  onPickEmoji,
  onSkinTone,
  skinTone,
  button,
}) => {
  const root = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const [loading, setLoading] = React.useState(!EmojiPicker || !Emoji);

  const loadEmojiPicker = React.useCallback(async() => {
    if (EmojiPicker) return;
    setLoading(true);
    try {
      const EmojiMart = await EmojiPickerAsync();
      EmojiPicker = EmojiMart.Picker;
      Emoji = EmojiMart.Emoji;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadEmojiPicker();
  }, []);

  const handleClose = React.useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    setActive(false);
  }, []);

  const handleToggle = React.useCallback((e) => {
    e.stopPropagation();
    if (loading) return;
    if (e.key === 'Escape') {
      setActive(false);
      return;
    }

    if ((!e.key || e.key === 'Enter')) {
      setActive(!active);
    }
  }, [active, loading]);

  return (
    <>
      <div className='relative' ref={root} onKeyDown={handleToggle}>
        <IconButton
          className={classNames({
            'text-gray-400 hover:text-gray-600': true,
            'pulse-loading': active && loading,
          })}
          alt='😀'
          src={require('@tabler/icons/mood-happy.svg')}
          onClick={handleToggle}
        />
        <Wrapper target={root} show={active}>
          <EmojiPickerMenu
            Emoji={Emoji}
            EmojiPicker={EmojiPicker}
            custom_emojis={custom_emojis}
            loading={loading}
            onClose={handleClose}
            onPick={onPickEmoji}
            onSkinTone={onSkinTone}
            skinTone={skinTone}
            frequentlyUsedEmojis={frequentlyUsedEmojis}
          />
        </Wrapper>
      </div>
    </>
  );
};

export default EmojiPickerUI;
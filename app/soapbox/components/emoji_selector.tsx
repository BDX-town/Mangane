// import classNames from 'classnames';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { EmojiSelector as RealEmojiSelector } from 'soapbox/components/ui';

import type { List as ImmutableList } from 'immutable';
import type { RootState } from 'soapbox/store';

const mapStateToProps = (state: RootState) => ({
  allowedEmoji: getSoapboxConfig(state).allowedEmoji,
});

interface IEmojiSelector {
  allowedEmoji: ImmutableList<string>,
  onReact: (emoji: string) => void,
  onUnfocus: () => void,
  visible: boolean,
  focused?: boolean,
}

class EmojiSelector extends ImmutablePureComponent<IEmojiSelector> {

  static defaultProps: Partial<IEmojiSelector> = {
    onReact: () => {},
    onUnfocus: () => {},
    visible: false,
  }

  node?: HTMLDivElement = undefined;

  handleBlur: React.FocusEventHandler<HTMLDivElement> = e => {
    const { focused, onUnfocus } = this.props;

    if (focused && (!e.currentTarget || !e.currentTarget.classList.contains('emoji-react-selector__emoji'))) {
      onUnfocus();
    }
  }

  _selectPreviousEmoji = (i: number): void => {
    if (!this.node) return;

    if (i !== 0) {
      const button: HTMLButtonElement | null = this.node.querySelector(`.emoji-react-selector__emoji:nth-child(${i})`);
      button?.focus();
    } else {
      const button: HTMLButtonElement | null = this.node.querySelector('.emoji-react-selector__emoji:last-child');
      button?.focus();
    }
  };

  _selectNextEmoji = (i: number) => {
    if (!this.node) return;

    if (i !== this.props.allowedEmoji.size - 1) {
      const button: HTMLButtonElement | null = this.node.querySelector(`.emoji-react-selector__emoji:nth-child(${i + 2})`);
      button?.focus();
    } else {
      const button: HTMLButtonElement | null = this.node.querySelector('.emoji-react-selector__emoji:first-child');
      button?.focus();
    }
  };

  handleKeyDown = (i: number): React.KeyboardEventHandler => e => {
    const { onUnfocus } = this.props;

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) this._selectPreviousEmoji(i);
        else this._selectNextEmoji(i);
        break;
      case 'Left':
      case 'ArrowLeft':
        this._selectPreviousEmoji(i);
        break;
      case 'Right':
      case 'ArrowRight':
        this._selectNextEmoji(i);
        break;
      case 'Escape':
        onUnfocus();
        break;
    }
  }

  handleReact = (emoji: string) => (): void => {
    const { onReact, focused, onUnfocus } = this.props;

    onReact(emoji);

    if (focused) {
      onUnfocus();
    }
  }

  handlers = {
    open: () => {},
  };

  setRef = (c: HTMLDivElement): void => {
    this.node = c;
  }

  render() {
    const { visible, focused, allowedEmoji, onReact } = this.props;

    return (
      <HotKeys handlers={this.handlers}>
        {/*<div
          className={classNames('flex absolute bg-white dark:bg-slate-500 px-2 py-3 rounded-full shadow-md opacity-0 pointer-events-none duration-100 w-max', { 'opacity-100 pointer-events-auto z-[999]': visible || focused })}
          onBlur={this.handleBlur}
          ref={this.setRef}
        >
          {allowedEmoji.map((emoji, i) => (
            <button
              key={i}
              className='emoji-react-selector__emoji'
              onClick={this.handleReact(emoji)}
              onKeyDown={this.handleKeyDown(i)}
              tabIndex={(visible || focused) ? 0 : -1}
            >
              <Emoji emoji={emoji} />
            </button>
          ))}
        </div>*/}
        <RealEmojiSelector
          emojis={allowedEmoji.toArray()}
          onReact={onReact}
          visible={visible}
          focused={focused}
        />
      </HotKeys>
    );
  }

}

export default connect(mapStateToProps)(EmojiSelector);

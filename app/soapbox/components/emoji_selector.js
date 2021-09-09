import React from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import emojify from 'soapbox/features/emoji/emoji';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import classNames from 'classnames';

const mapStateToProps = state => ({
  allowedEmoji: getSoapboxConfig(state).get('allowedEmoji'),
});

export default @connect(mapStateToProps)
class EmojiSelector extends ImmutablePureComponent {

  static propTypes = {
    onReact: PropTypes.func.isRequired,
    onUnfocus: PropTypes.func,
    visible: PropTypes.bool,
    focused: PropTypes.bool,
  }

  static defaultProps = {
    onReact: () => {},
    onUnfocus: () => {},
    visible: false,
  }

  handleBlur = e => {
    const { focused, onUnfocus } = this.props;

    if (focused && (!e.relatedTarget || !e.relatedTarget.classList.contains('emoji-react-selector__emoji'))) {
      onUnfocus();
    }
  }

  _selectPreviousEmoji = i => {
    if (i !== 0) {
      this.node.querySelector(`.emoji-react-selector__emoji:nth-child(${i})`).focus();
    } else {
      this.node.querySelector('.emoji-react-selector__emoji:last-child').focus();
    }
  };

  _selectNextEmoji = i => {
    if (i !== this.props.allowedEmoji.size - 1) {
      this.node.querySelector(`.emoji-react-selector__emoji:nth-child(${i + 2})`).focus();
    } else {
      this.node.querySelector('.emoji-react-selector__emoji:first-child').focus();
    }
  };

  handleKeyDown = i => e => {
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

  handleReact = emoji => () => {
    const { onReact, focused, onUnfocus } = this.props;

    onReact(emoji)();

    if (focused) {
      onUnfocus();
    }
  }

  handlers = {
    open: () => {},
  };

  setRef = c => {
    this.node = c;
  }

  render() {
    const { visible, focused, allowedEmoji } = this.props;

    return (
      <HotKeys
        handlers={this.handlers}
        className='emoji-react-selector-container'
      >
        <div
          className={classNames('emoji-react-selector', { 'emoji-react-selector--visible': visible, 'emoji-react-selector--focused': focused })}
          onBlur={this.handleBlur}
          ref={this.setRef}
        >
          {allowedEmoji.map((emoji, i) => (
            <button
              key={i}
              className='emoji-react-selector__emoji'
              dangerouslySetInnerHTML={{ __html: emojify(emoji) }}
              onClick={this.handleReact(emoji)}
              onKeyDown={this.handleKeyDown(i, emoji)}
              tabIndex={(visible || focused) ? 0 : -1}
            />
          ))}
        </div>
      </HotKeys>
    );
  }

}

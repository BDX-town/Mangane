import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';

import { IconButton } from 'soapbox/components/ui';

import { isMobile } from '../../../is_mobile';
import { buildCustomEmojis } from '../../emoji/emoji';

const messages = defineMessages({
  emoji: { id: 'emoji_button.label', defaultMessage: 'Insert emoji' },
  emoji_search: { id: 'emoji_button.search', defaultMessage: 'Search…' },
  emoji_not_found: { id: 'emoji_button.not_found', defaultMessage: 'No emoji\'s found.' },
  custom: { id: 'emoji_button.custom', defaultMessage: 'Custom' },
  recent: { id: 'emoji_button.recent', defaultMessage: 'Frequently used' },
  search_results: { id: 'emoji_button.search_results', defaultMessage: 'Search results' },
  people: { id: 'emoji_button.people', defaultMessage: 'People' },
  nature: { id: 'emoji_button.nature', defaultMessage: 'Nature' },
  food: { id: 'emoji_button.food', defaultMessage: 'Food & Drink' },
  activity: { id: 'emoji_button.activity', defaultMessage: 'Activity' },
  travel: { id: 'emoji_button.travel', defaultMessage: 'Travel & Places' },
  objects: { id: 'emoji_button.objects', defaultMessage: 'Objects' },
  symbols: { id: 'emoji_button.symbols', defaultMessage: 'Symbols' },
  flags: { id: 'emoji_button.flags', defaultMessage: 'Flags' },
});

const backgroundImageFn = () => require('emoji-datasource/img/twitter/sheets/32.png');
const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

const categoriesSort = [
  'recent',
  'custom',
  'people',
  'nature',
  'foods',
  'activity',
  'places',
  'objects',
  'symbols',
  'flags',
];

class ModifierPickerMenu extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    Emoji: PropTypes.any.isRequired,
  };

  handleClick = e => {
    this.props.onSelect(e.currentTarget.getAttribute('data-index') * 1);
  }

  componentDidUpdate(prevProps) {
    if (this.props.active) {
      this.attachListeners();
    } else {
      this.removeListeners();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  attachListeners() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  removeListeners() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  render() {
    const { active, Emoji } = this.props;

    return (
      <div className='emoji-picker-dropdown__modifiers__menu' style={{ display: active ? 'block' : 'none' }} ref={this.setRef}>
        <button onClick={this.handleClick} data-index={1}><Emoji emoji='thumbsup' set='twitter' size={22} sheetSize={32} skin={1} backgroundImageFn={backgroundImageFn} /></button>
        <button onClick={this.handleClick} data-index={2}><Emoji emoji='thumbsup' set='twitter' size={22} sheetSize={32} skin={2} backgroundImageFn={backgroundImageFn} /></button>
        <button onClick={this.handleClick} data-index={3}><Emoji emoji='thumbsup' set='twitter' size={22} sheetSize={32} skin={3} backgroundImageFn={backgroundImageFn} /></button>
        <button onClick={this.handleClick} data-index={4}><Emoji emoji='thumbsup' set='twitter' size={22} sheetSize={32} skin={4} backgroundImageFn={backgroundImageFn} /></button>
        <button onClick={this.handleClick} data-index={5}><Emoji emoji='thumbsup' set='twitter' size={22} sheetSize={32} skin={5} backgroundImageFn={backgroundImageFn} /></button>
        <button onClick={this.handleClick} data-index={6}><Emoji emoji='thumbsup' set='twitter' size={22} sheetSize={32} skin={6} backgroundImageFn={backgroundImageFn} /></button>
      </div>
    );
  }

}

class ModifierPicker extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    modifier: PropTypes.number,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    Emoji: PropTypes.any.isRequired,
  };

  handleClick = () => {
    if (this.props.active) {
      this.props.onClose();
    } else {
      this.props.onOpen();
    }
  }

  handleSelect = modifier => {
    this.props.onChange(modifier);
    this.props.onClose();
  }

  render() {
    const { active, modifier, Emoji } = this.props;

    return (
      <div className='emoji-picker-dropdown__modifiers'>
        <Emoji emoji='thumbsup' set='twitter' size={22} sheetSize={32} skin={modifier} onClick={this.handleClick} backgroundImageFn={backgroundImageFn} />
        <ModifierPickerMenu Emoji={Emoji} active={active} onSelect={this.handleSelect} onClose={this.props.onClose} />
      </div>
    );
  }

}

export default @injectIntl
class EmojiPickerMenu extends React.PureComponent {

  static propTypes = {
    custom_emojis: ImmutablePropTypes.list,
    frequentlyUsedEmojis: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onPick: PropTypes.func.isRequired,
    style: PropTypes.object,
    placement: PropTypes.string,
    arrowOffsetLeft: PropTypes.string,
    arrowOffsetTop: PropTypes.string,
    intl: PropTypes.object.isRequired,
    skinTone: PropTypes.number.isRequired,
    onSkinTone: PropTypes.func.isRequired,
    EmojiPicker: PropTypes.any.isRequired,
    Emoji: PropTypes.any.isRequired,
  };

  static defaultProps = {
    style: {},
    loading: true,
    frequentlyUsedEmojis: [],
  };

  state = {
    modifierOpen: false,
    placement: null,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  getI18n = () => {
    const { intl } = this.props;

    return {
      search: intl.formatMessage(messages.emoji_search),
      notfound: intl.formatMessage(messages.emoji_not_found),
      categories: {
        search: intl.formatMessage(messages.search_results),
        recent: intl.formatMessage(messages.recent),
        people: intl.formatMessage(messages.people),
        nature: intl.formatMessage(messages.nature),
        foods: intl.formatMessage(messages.food),
        activity: intl.formatMessage(messages.activity),
        places: intl.formatMessage(messages.travel),
        objects: intl.formatMessage(messages.objects),
        symbols: intl.formatMessage(messages.symbols),
        flags: intl.formatMessage(messages.flags),
        custom: intl.formatMessage(messages.custom),
      },
    };
  }

  handleClick = emoji => {
    if (!emoji.native) {
      emoji.native = emoji.colons;
    }

    this.props.onClose();
    this.props.onPick(emoji);
  }

  handleModifierOpen = () => {
    this.setState({ modifierOpen: true });
  }

  handleModifierClose = () => {
    this.setState({ modifierOpen: false });
  }

  handleModifierChange = modifier => {
    this.props.onSkinTone(modifier);
  }

  render() {
    const { loading, style, intl, custom_emojis, skinTone, frequentlyUsedEmojis, EmojiPicker, Emoji, onClose } = this.props;

    if (loading) {
      return <div style={{ width: 299 }} />;
    }

    const title = intl.formatMessage(messages.emoji);
    const { modifierOpen } = this.state;

    return (
      <div className={classNames('emoji-picker-dropdown__menu grow flex flex-col', { selecting: modifierOpen, 'absolute': !isMobile(window.innerWidth) })} style={style} ref={this.setRef}>
        <IconButton
          alt='Close'
          className='ml-auto'
          src={require('@tabler/icons/x.svg')}
          onClick={onClose}
        />
        <div className='grow relative'>
          <EmojiPicker
            perLine={8}
            emojiSize={22}
            sheetSize={32}
            custom={buildCustomEmojis(custom_emojis)}
            color=''
            emoji=''
            set='twitter'
            title={title}
            i18n={this.getI18n()}
            onClick={this.handleClick}
            include={categoriesSort}
            recent={frequentlyUsedEmojis}
            skin={skinTone}
            showPreview={false}
            backgroundImageFn={backgroundImageFn}
            emojiTooltip
          />

          <ModifierPicker
            Emoji={Emoji}
            active={modifierOpen}
            modifier={skinTone}
            onOpen={this.handleModifierOpen}
            onClose={this.handleModifierClose}
            onChange={this.handleModifierChange}
          />
        </div>
      </div>
    );
  }

}


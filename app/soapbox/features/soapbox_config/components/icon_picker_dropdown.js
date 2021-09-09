import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Picker from 'emoji-mart/dist-es/components/picker/picker';
import Overlay from 'react-overlays/lib/Overlay';
import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  emoji: { id: 'icon_button.label', defaultMessage: 'Select icon' },
  emoji_search: { id: 'emoji_button.search', defaultMessage: 'Search…' },
  emoji_not_found: { id: 'icon_button.not_found', defaultMessage: 'No icons!! (╯°□°）╯︵ ┻━┻' },
  custom: { id: 'icon_button.icons', defaultMessage: 'Icons' },
  search_results: { id: 'emoji_button.search_results', defaultMessage: 'Search results' },
});

const backgroundImageFn = () => '';
const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

const categoriesSort = ['custom'];

@injectIntl
class IconPickerMenu extends React.PureComponent {

  static propTypes = {
    custom_emojis: PropTypes.object,
    loading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onPick: PropTypes.func.isRequired,
    style: PropTypes.object,
    placement: PropTypes.string,
    arrowOffsetLeft: PropTypes.string,
    arrowOffsetTop: PropTypes.string,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    style: {},
    loading: true,
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

    if (!c) return;

    // Nice and dirty hack to display the icons
    c.querySelectorAll('button.emoji-mart-emoji > span').forEach(elem => {
      elem.innerHTML = `<i class="fa fa-${elem.parentNode.getAttribute('title')}"></i>`;
    });
  }

  getI18n = () => {
    const { intl } = this.props;

    return {
      search: intl.formatMessage(messages.emoji_search),
      notfound: intl.formatMessage(messages.emoji_not_found),
      categories: {
        search: intl.formatMessage(messages.search_results),
        custom: intl.formatMessage(messages.custom),
      },
    };
  }

  handleClick = emoji => {
    emoji.native = emoji.colons;

    this.props.onClose();
    this.props.onPick(emoji);
  }

  buildIcons = (customEmojis, autoplay = false) => {
    const emojis = [];

    Object.values(customEmojis).forEach(category => {
      category.forEach(function(icon) {
        const name = icon.replace('fa fa-', '');
        if (icon !== 'email' && icon !== 'memo') {
          emojis.push({
            id: name,
            name,
            short_names: [name],
            emoticons: [],
            keywords: [name],
            imageUrl: '',
          });
        }
      });
    });

    return emojis;
  };

  render() {
    const { loading, style, intl, custom_emojis } = this.props;

    if (loading) {
      return <div style={{ width: 299 }} />;
    }

    const data = { compressed: true, categories: [], aliases: [], emojis: [] };
    const title = intl.formatMessage(messages.emoji);
    const { modifierOpen } = this.state;

    return (
      <div className={classNames('font-icon-picker emoji-picker-dropdown__menu', { selecting: modifierOpen })} style={style} ref={this.setRef}>
        <Picker
          perLine={8}
          emojiSize={22}
          include={categoriesSort}
          sheetSize={32}
          custom={this.buildIcons(custom_emojis)}
          color=''
          emoji=''
          set=''
          title={title}
          i18n={this.getI18n()}
          onClick={this.handleClick}
          showPreview={false}
          backgroundImageFn={backgroundImageFn}
          emojiTooltip
          noShowAnchors
          data={data}
        />
      </div>
    );
  }

}

export default @injectIntl
class IconPickerDropdown extends React.PureComponent {

  static propTypes = {
    frequentlyUsedEmojis: PropTypes.arrayOf(PropTypes.string),
    intl: PropTypes.object.isRequired,
    onPickEmoji: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  state = {
    active: false,
    loading: false,
  };

  setRef = (c) => {
    this.dropdown = c;
  }

  onShowDropdown = ({ target }) => {
    this.setState({ active: true });

    const { top } = target.getBoundingClientRect();
    this.setState({ placement: top * 2 < innerHeight ? 'bottom' : 'top' });
  }

  onHideDropdown = () => {
    this.setState({ active: false });
  }

  onToggle = (e) => {
    if (!this.state.loading && (!e.key || e.key === 'Enter')) {
      if (this.state.active) {
        this.onHideDropdown();
      } else {
        this.onShowDropdown(e);
      }
    }
  }

  handleKeyDown = e => {
    if (e.key === 'Escape') {
      this.onHideDropdown();
    }
  }

  setTargetRef = c => {
    this.target = c;
  }

  findTarget = () => {
    return this.target;
  }

  render() {
    const { intl, onPickEmoji, value } = this.props;
    const title = intl.formatMessage(messages.emoji);
    const { active, loading, placement } = this.state;
    const forkAwesomeIcons = require('../forkawesome.json');

    return (
      <div className='font-icon-picker-dropdown' onKeyDown={this.handleKeyDown}>
        <div ref={this.setTargetRef} className='font-icon-button' title={title} aria-label={title} aria-expanded={active} role='button' onClick={this.onToggle} onKeyDown={this.onToggle} tabIndex={0}>
          <Icon id={value} />
        </div>

        <Overlay show={active} placement={placement} target={this.findTarget}>
          <IconPickerMenu
            custom_emojis={forkAwesomeIcons}
            loading={loading}
            onClose={this.onHideDropdown}
            onPick={onPickEmoji}
          />
        </Overlay>
      </div>
    );
  }

}

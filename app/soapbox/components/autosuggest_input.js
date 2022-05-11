import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import Icon from 'soapbox/components/icon';

import AutosuggestAccount from '../features/compose/components/autosuggest_account';
import { isRtl } from '../rtl';

import AutosuggestEmoji from './autosuggest_emoji';

const textAtCursorMatchesToken = (str, caretPosition, searchTokens) => {
  let word;

  const left  = str.slice(0, caretPosition).search(/\S+$/);
  const right = str.slice(caretPosition).search(/\s/);

  if (right < 0) {
    word = str.slice(left);
  } else {
    word = str.slice(left, right + caretPosition);
  }

  if (!word || word.trim().length < 3 || searchTokens.indexOf(word[0]) === -1) {
    return [null, null];
  }

  word = word.trim().toLowerCase();

  if (word.length > 0) {
    return [left + 1, word];
  } else {
    return [null, null];
  }
};

export default class AutosuggestInput extends ImmutablePureComponent {

  static propTypes = {
    value: PropTypes.string,
    suggestions: ImmutablePropTypes.list,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onSuggestionSelected: PropTypes.func.isRequired,
    onSuggestionsClearRequested: PropTypes.func.isRequired,
    onSuggestionsFetchRequested: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    autoFocus: PropTypes.bool,
    autoSelect: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    searchTokens: PropTypes.arrayOf(PropTypes.string),
    maxLength: PropTypes.number,
    menu: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    autoFocus: false,
    autoSelect: true,
    searchTokens: ImmutableList(['@', ':', '#']),
  };

  getFirstIndex = () => {
    return this.props.autoSelect ? 0 : -1;
  }

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: this.getFirstIndex(),
    lastToken: null,
    tokenStart: 0,
  };

  onChange = (e) => {
    const [ tokenStart, token ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart, this.props.searchTokens);

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      this.props.onSuggestionsFetchRequested(token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    this.props.onChange(e);
  }

  onKeyDown = (e) => {
    const { suggestions, menu, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;
    const firstIndex = this.getFirstIndex();
    const lastIndex = suggestions.size + (menu || []).length - 1;

    if (disabled) {
      e.preventDefault();
      return;
    }

    if (e.which === 229 || e.isComposing) {
      // Ignore key events during text composition
      // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
      return;
    }

    switch (e.key) {
      case 'Escape':
        if (suggestions.size === 0 || suggestionsHidden) {
          document.querySelector('.ui').parentElement.focus();
        } else {
          e.preventDefault();
          this.setState({ suggestionsHidden: true });
        }

        break;
      case 'ArrowDown':
        if (!suggestionsHidden && (suggestions.size > 0 || menu)) {
          e.preventDefault();
          this.setState({ selectedSuggestion: Math.min(selectedSuggestion + 1, lastIndex) });
        }

        break;
      case 'ArrowUp':
        if (!suggestionsHidden && (suggestions.size > 0 || menu)) {
          e.preventDefault();
          this.setState({ selectedSuggestion: Math.max(selectedSuggestion - 1, firstIndex) });
        }

        break;
      case 'Enter':
      case 'Tab':
      // Select suggestion
        if (!suggestionsHidden && selectedSuggestion > -1 && (suggestions.size > 0 || menu)) {
          e.preventDefault();
          e.stopPropagation();
          this.setState({ selectedSuggestion: firstIndex });

          if (selectedSuggestion < suggestions.size) {
            this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
          } else {
            const item = menu[selectedSuggestion - suggestions.size];
            this.handleMenuItemAction(item);
          }
        }

        break;
    }

    if (e.defaultPrevented || !this.props.onKeyDown) {
      return;
    }

    this.props.onKeyDown(e);
  }

  onBlur = () => {
    this.setState({ suggestionsHidden: true, focused: false });
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onSuggestionClick = (e) => {
    const suggestion = this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
    e.preventDefault();
    this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
    this.input.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    const { suggestions } = this.props;
    if (suggestions !== prevProps.suggestions && suggestions.size > 0 && prevState.suggestionsHidden && prevState.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setInput = (c) => {
    this.input = c;
  }

  renderSuggestion = (suggestion, i) => {
    const { selectedSuggestion } = this.state;
    let inner, key;

    if (typeof suggestion === 'object') {
      inner = <AutosuggestEmoji emoji={suggestion} />;
      key   = suggestion.id;
    } else if (suggestion[0] === '#') {
      inner = suggestion;
      key   = suggestion;
    } else {
      inner = <AutosuggestAccount id={suggestion} />;
      key   = suggestion;
    }

    return (
      <div
        role='button'
        tabIndex='0'
        key={key}
        data-index={i}
        className={classNames({
          'px-4 py-2.5 text-sm text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group': true,
          'bg-gray-100 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-gray-700': i === selectedSuggestion,
        })}
        onMouseDown={this.onSuggestionClick}
      >
        {inner}
      </div>
    );
  }

  handleMenuItemAction = item => {
    this.onBlur();
    item.action();
  }

  handleMenuItemClick = item => {
    return e => {
      e.preventDefault();
      this.handleMenuItemAction(item);
    };
  }

  renderMenu = () => {
    const { menu, suggestions } = this.props;
    const { selectedSuggestion } = this.state;

    if (!menu) {
      return null;
    }

    return menu.map((item, i) => (
      <a
        className={classNames('flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700', { selected: suggestions.size - selectedSuggestion === i })}
        href='#'
        role='button'
        tabIndex='0'
        onMouseDown={this.handleMenuItemClick(item)}
        key={i}
      >
        {item.icon && (
          <Icon src={item.icon} />
        )}

        <span>{item.text}</span>
      </a>
    ));
  };

  render() {
    const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, className, id, maxLength, menu } = this.props;
    const { suggestionsHidden } = this.state;
    const style = { direction: 'ltr' };

    const visible = !suggestionsHidden && (!suggestions.isEmpty() || (menu && value));

    if (isRtl(value)) {
      style.direction = 'rtl';
    }

    return (
      <div className='relative'>
        <label className='sr-only'>{placeholder}</label>

        <input
          type='text'
          className={classNames({
            'block w-full sm:text-sm dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500': true,
            [className]: typeof className !== 'undefined',
          })}
          ref={this.setInput}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          style={style}
          aria-autocomplete='list'
          id={id}
          maxLength={maxLength}
          data-testid='autosuggest-input'
        />

        <div className={classNames({
          'absolute top-full w-full z-50 shadow bg-white dark:bg-slate-800 rounded-lg py-1': true,
          hidden: !visible,
          block: visible,
          'autosuggest-textarea__suggestions--visible': visible,
        })}
        >
          <div className='space-y-0.5'>
            {suggestions.map(this.renderSuggestion)}
          </div>

          {this.renderMenu()}
        </div>
      </div>
    );
  }

}

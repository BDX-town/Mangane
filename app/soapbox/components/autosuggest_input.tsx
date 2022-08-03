import Portal from '@reach/portal';
import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';

import AutosuggestEmoji, { Emoji } from 'soapbox/components/autosuggest_emoji';
import Icon from 'soapbox/components/icon';
import AutosuggestAccount from 'soapbox/features/compose/components/autosuggest_account';
import { isRtl } from 'soapbox/rtl';

import type { Menu, MenuItem } from 'soapbox/components/dropdown_menu';

type CursorMatch = [
  tokenStart: number | null,
  token: string | null,
];

export type AutoSuggestion = string | Emoji;

const textAtCursorMatchesToken = (str: string, caretPosition: number, searchTokens: string[]): CursorMatch => {
  let word: string;

  const left: number = str.slice(0, caretPosition).search(/\S+$/);
  const right: number = str.slice(caretPosition).search(/\s/);

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

interface IAutosuggestInput extends Pick<React.HTMLAttributes<HTMLInputElement>, 'onChange' | 'onKeyUp' | 'onKeyDown'> {
  value: string,
  suggestions: ImmutableList<any>,
  disabled?: boolean,
  placeholder?: string,
  onSuggestionSelected: (tokenStart: number, lastToken: string | null, suggestion: AutoSuggestion) => void,
  onSuggestionsClearRequested: () => void,
  onSuggestionsFetchRequested: (token: string) => void,
  autoFocus: boolean,
  autoSelect: boolean,
  className?: string,
  id?: string,
  searchTokens: string[],
  maxLength?: number,
  menu?: Menu,
  resultsPosition: string,
}

export default class AutosuggestInput extends ImmutablePureComponent<IAutosuggestInput> {

  static defaultProps = {
    autoFocus: false,
    autoSelect: true,
    searchTokens: ImmutableList(['@', ':', '#']),
    resultsPosition: 'below',
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

  input: HTMLInputElement | null = null;

  onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const [tokenStart, token] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart || 0, this.props.searchTokens);

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      this.props.onSuggestionsFetchRequested(token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const { suggestions, menu, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;
    const firstIndex = this.getFirstIndex();
    const lastIndex = suggestions.size + (menu || []).length - 1;

    if (disabled) {
      e.preventDefault();
      return;
    }

    if (e.which === 229) {
      // Ignore key events during text composition
      // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
      return;
    }

    switch (e.key) {
      case 'Escape':
        if (suggestions.size === 0 || suggestionsHidden) {
          document.querySelector('.ui')?.parentElement?.focus();
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
          } else if (menu) {
            const item = menu[selectedSuggestion - suggestions.size];
            this.handleMenuItemAction(item, e);
          }
        }

        break;
    }

    if (e.defaultPrevented || !this.props.onKeyDown) {
      return;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  onBlur = () => {
    this.setState({ suggestionsHidden: true, focused: false });
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onSuggestionClick: React.EventHandler<React.MouseEvent | React.TouchEvent> = (e) => {
    const index = Number(e.currentTarget?.getAttribute('data-index'));
    const suggestion = this.props.suggestions.get(index);
    this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
    this.input?.focus();
    e.preventDefault();
  }

  componentDidUpdate(prevProps: IAutosuggestInput, prevState: any) {
    const { suggestions } = this.props;
    if (suggestions !== prevProps.suggestions && suggestions.size > 0 && prevState.suggestionsHidden && prevState.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setInput = (c: HTMLInputElement) => {
    this.input = c;
  }

  renderSuggestion = (suggestion: AutoSuggestion, i: number) => {
    const { selectedSuggestion } = this.state;
    let inner, key;

    if (typeof suggestion === 'object') {
      inner = <AutosuggestEmoji emoji={suggestion} />;
      key = suggestion.id;
    } else if (suggestion[0] === '#') {
      inner = suggestion;
      key = suggestion;
    } else {
      inner = <AutosuggestAccount id={suggestion} />;
      key = suggestion;
    }

    return (
      <div
        role='button'
        tabIndex={0}
        key={key}
        data-index={i}
        className={classNames({
          'px-4 py-2.5 text-sm text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-primary-800 group': true,
          'bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800': i === selectedSuggestion,
        })}
        onMouseDown={this.onSuggestionClick}
        onTouchEnd={this.onSuggestionClick}
      >
        {inner}
      </div>
    );
  }

  handleMenuItemAction = (item: MenuItem | null, e: React.MouseEvent | React.KeyboardEvent) => {
    this.onBlur();
    if (item?.action) {
      item.action(e);
    }
  }

  handleMenuItemClick = (item: MenuItem | null): React.MouseEventHandler => {
    return e => {
      e.preventDefault();
      this.handleMenuItemAction(item, e);
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
        className={classNames('flex items-center space-x-2 px-4 py-2.5 text-sm cursor-pointer text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-primary-800', { selected: suggestions.size - selectedSuggestion === i })}
        href='#'
        role='button'
        tabIndex={0}
        onMouseDown={this.handleMenuItemClick(item)}
        key={i}
      >
        {item?.icon && (
          <Icon src={item.icon} />
        )}

        <span>{item?.text}</span>
      </a>
    ));
  };

  setPortalPosition() {
    if (!this.input) {
      return {};
    }

    const { top, height, left, width } = this.input.getBoundingClientRect();

    if (this.props.resultsPosition === 'below') {
      return { left, width, top: top + height };
    }

    return { left, width, top, transform: 'translate(0, -100%)' };
  }

  render() {
    const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, className, id, maxLength, menu } = this.props;
    const { suggestionsHidden } = this.state;
    const style: React.CSSProperties = { direction: 'ltr' };

    const visible = !suggestionsHidden && (!suggestions.isEmpty() || (menu && value));

    if (isRtl(value)) {
      style.direction = 'rtl';
    }

    return [
      <div key='input' className='relative w-full'>
        <label className='sr-only'>{placeholder}</label>

        <input
          type='text'
          className={classNames({
            'block w-full sm:text-sm border-gray-200 dark:border-gray-800 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-600 focus:border-gray-200 dark:focus-border-gray-800 focus:ring-primary-500 focus:ring-2': true,
          }, className)}
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
      </div>,
      <Portal key='portal'>
        <div
          style={this.setPortalPosition()}
          className={classNames({
            'fixed w-full z-[1001] shadow bg-white dark:bg-gray-900 rounded-lg py-1 dark:ring-2 dark:ring-primary-700 focus:outline-none': true,
            hidden: !visible,
            block: visible,
          })}
        >
          <div className='space-y-0.5'>
            {suggestions.map(this.renderSuggestion)}
          </div>

          {this.renderMenu()}
        </div>
      </Portal>,
    ];
  }

}

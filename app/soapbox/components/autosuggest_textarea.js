import Portal from '@reach/portal';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Textarea from 'react-textarea-autosize';

import AutosuggestAccount from '../features/compose/components/autosuggest_account';
import { isRtl } from '../rtl';

import AutosuggestEmoji from './autosuggest_emoji';

const textAtCursorMatchesToken = (str, caretPosition) => {
  let word;

  const left  = str.slice(0, caretPosition).search(/\S+$/);
  const right = str.slice(caretPosition).search(/\s/);

  if (right < 0) {
    word = str.slice(left);
  } else {
    word = str.slice(left, right + caretPosition);
  }

  if (!word || word.trim().length < 3 || ['@', ':', '#'].indexOf(word[0]) === -1) {
    return [null, null];
  }

  word = word.trim().toLowerCase();

  if (word.length > 0) {
    return [left + 1, word];
  } else {
    return [null, null];
  }
};

export default class AutosuggestTextarea extends ImmutablePureComponent {

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
    onPaste: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    condensed: PropTypes.bool,
  };

  static defaultProps = {
    autoFocus: true,
  };

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: 0,
    lastToken: null,
    tokenStart: 0,
  };

  onChange = (e) => {
    const [ tokenStart, token ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart);

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
    const { suggestions, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;

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
        if (suggestions.size > 0 && !suggestionsHidden) {
          e.preventDefault();
          this.setState({ selectedSuggestion: Math.min(selectedSuggestion + 1, suggestions.size - 1) });
        }

        break;
      case 'ArrowUp':
        if (suggestions.size > 0 && !suggestionsHidden) {
          e.preventDefault();
          this.setState({ selectedSuggestion: Math.max(selectedSuggestion - 1, 0) });
        }

        break;
      case 'Enter':
      case 'Tab':
      // Select suggestion
        if (this.state.lastToken !== null && suggestions.size > 0 && !suggestionsHidden) {
          e.preventDefault();
          e.stopPropagation();
          this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
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

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  onFocus = () => {
    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  onSuggestionClick = (e) => {
    const suggestion = this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
    e.preventDefault();
    this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
    this.textarea.focus();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Skip updating when only the lastToken changes so the
    // cursor doesn't jump around due to re-rendering unnecessarily
    const lastTokenUpdated = this.state.lastToken !== nextState.lastToken;
    const valueUpdated = this.props.value !== nextProps.value;

    if (lastTokenUpdated && !valueUpdated) {
      return false;
    } else {
      return super.shouldComponentUpdate(nextProps, nextState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { suggestions } = this.props;
    if (suggestions !== prevProps.suggestions && suggestions.size > 0 && prevState.suggestionsHidden && prevState.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setTextarea = (c) => {
    this.textarea = c;
  }

  onPaste = (e) => {
    if (e.clipboardData && e.clipboardData.files.length === 1) {
      this.props.onPaste(e.clipboardData.files);
      e.preventDefault();
    }
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
          'bg-gray-100 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700': i === selectedSuggestion,
        })}
        onMouseDown={this.onSuggestionClick}
      >
        {inner}
      </div>
    );
  }

  setPortalPosition() {
    if (!this.textarea) {
      return {};
    }

    const { top, height, left, width } = this.textarea.getBoundingClientRect();

    return {
      top: top + height,
      left,
      width,
    };
  }

  render() {
    const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, children, condensed, id } = this.props;
    const { suggestionsHidden } = this.state;
    const style = { direction: 'ltr', minRows: 10 };

    if (isRtl(value)) {
      style.direction = 'rtl';
    }

    return [
      <div key='textarea'>
        <div className='relative'>
          <label>
            <span style={{ display: 'none' }}>{placeholder}</span>

            <Textarea
              ref={this.setTextarea}
              className={classNames('transition-[min-height] motion-reduce:transition-none dark:bg-slate-800 px-0 border-0 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none w-full focus:shadow-none focus:border-0 focus:ring-0', {
                'min-h-[40px]': condensed,
                'min-h-[100px]': !condensed,
              })}
              id={id}
              disabled={disabled}
              placeholder={placeholder}
              autoFocus={autoFocus}
              value={value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onPaste={this.onPaste}
              style={style}
              aria-autocomplete='list'
            />
          </label>
        </div>

        {children}
      </div>,

      <Portal key='portal'>
        <div
          style={this.setPortalPosition()}
          className={classNames({
            'fixed z-1000 shadow bg-white dark:bg-slate-900 rounded-lg py-1 space-y-0': true,
            hidden: suggestionsHidden || suggestions.isEmpty(),
            block: !suggestionsHidden && !suggestions.isEmpty(),
          })}
        >
          {suggestions.map(this.renderSuggestion)}
        </div>
      </Portal>,
    ];
  }

}

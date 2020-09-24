import React from 'react';
import { connect } from 'react-redux';
import AutosuggestAccountContainer from '../features/compose/containers/autosuggest_account_container';
import AutosuggestEmoji from './autosuggest_emoji';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { isRtl } from '../rtl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Textarea from 'react-textarea-autosize';
import classNames from 'classnames';
import UploadArea from 'soapbox/features/ui/components/upload_area';
import { uploadCompose } from 'soapbox/actions/compose';

const textAtCursorMatchesToken = (str, caretPosition) => {
  let word;

  let left  = str.slice(0, caretPosition).search(/\S+$/);
  let right = str.slice(caretPosition).search(/\s/);

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

export default @connect()
class AutosuggestTextarea extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
    // onAttachment: PropTypes.func,
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
    draggingOver: false,
  };

  componentDidMount() {
    this.node.addEventListener('dragenter', this.handleDragEnter, false);
    this.node.addEventListener('dragover', this.handleDragOver, false);
    this.node.addEventListener('drop', this.handleDrop, false);
    this.node.addEventListener('dragleave', this.handleDragLeave, false);
    this.node.addEventListener('dragend', this.handleDragEnd, false);
  }

  componentWillUnmount() {
    this.node.removeEventListener('dragenter', this.handleDragEnter);
    this.node.removeEventListener('dragover', this.handleDragOver);
    this.node.removeEventListener('drop', this.handleDrop);
    this.node.removeEventListener('dragleave', this.handleDragLeave);
    this.node.removeEventListener('dragend', this.handleDragEnd);
  }

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

    switch(e.key) {
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

  componentDidUpdate(prevProps, prevState) {
    const { suggestions } = this.props;
    if (suggestions !== prevProps.suggestions && suggestions.size > 0 && prevState.suggestionsHidden && prevState.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setTextarea = (c) => {
    this.textarea = c;
  }

  setRef = c => {
    this.node = c;
  }

  dataTransferIsText = (dataTransfer) => {
    return (dataTransfer && Array.from(dataTransfer.types).includes('text/plain') && dataTransfer.items.length === 1);
  }

  handleDragEnter = (e) => {
    e.preventDefault();

    if (!this.dragTargets) {
      this.dragTargets = [];
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target);
    }

    if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
      this.setState({ draggingOver: true });
    }
  }

  handleDragOver = (e) => {
    if (this.dataTransferIsText(e.dataTransfer)) return false;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.dataTransfer.dropEffect = 'copy';
    } catch (err) {

    }

    return false;
  }

  // handleAttachment = () => {
  //   const { onAttachment } = this.props;
  //   onAttachment(true);
  // }

  handleFiles = (files) => {
    const { dispatch } = this.props;

    this.setState({ isUploading: true });

    const data = new FormData();
    data.append('file', files[0]);
    dispatch(uploadCompose(data));
    // dispatch(this.handleAttachment());
    // dispatch(uploadMedia(data, this.onUploadProgress)).then(response => {
    //   this.setState({ attachment: response.data, isUploading: false });
    //   this.handleAttachment();
    // }).catch(() => {
    //   this.setState({ isUploading: false });
    // });
  }

  handleDrop = (e) => {
    if (this.dataTransferIsText(e.dataTransfer)) return;
    e.preventDefault();

    this.setState({ draggingOver: false });
    this.dragTargets = [];

    if (e.dataTransfer && e.dataTransfer.files.length >= 1) {
      this.handleFiles(e.dataTransfer.files);
      // this.props.dispatch(uploadCompose(e.dataTransfer.files));
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.node.contains(el));

    if (this.dragTargets.length > 0) {
      return;
    }

    this.setState({ draggingOver: false });
  }

  closeUploadModal = () => {
    this.setState({ draggingOver: false });
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
      inner = <AutosuggestAccountContainer id={suggestion} />;
      key   = suggestion;
    }

    return (
      <div role='button' tabIndex='0' key={key} data-index={i} className={classNames('autosuggest-textarea__suggestions__item', { selected: i === selectedSuggestion })} onMouseDown={this.onSuggestionClick}>
        {inner}
      </div>
    );
  }

  render() {
    const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, children } = this.props;
    const { suggestionsHidden } = this.state;
    const style = { direction: 'ltr' };
    const { draggingOver } = this.state;

    if (isRtl(value)) {
      style.direction = 'rtl';
    }

    return [
      <div className='compose-form__autosuggest-wrapper' key='compose-form__autosuggest-wrapper'>
        <div className='autosuggest-textarea' ref={this.setRef}>
          <UploadArea active={draggingOver} onClose={this.closeUploadModal} />
          <label>
            <span style={{ display: 'none' }}>{placeholder}</span>

            <Textarea
              inputRef={this.setTextarea}
              className='autosuggest-textarea__textarea'
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
      <div className='autosuggest-textarea__suggestions-wrapper' key='autosuggest-textarea__suggestions-wrapper'>
        <div className={`autosuggest-textarea__suggestions ${suggestionsHidden || suggestions.isEmpty() ? '' : 'autosuggest-textarea__suggestions--visible'}`}>
          {suggestions.map(this.renderSuggestion)}
        </div>
      </div>,
    ];
  }

}

import React from 'react';
import CharacterCounter from './character_counter';
import Button from '../../../components/button';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReplyIndicatorContainer from '../containers/reply_indicator_container';
import AutosuggestTextarea from '../../../components/autosuggest_textarea';
import AutosuggestInput from '../../../components/autosuggest_input';
import PollButtonContainer from '../containers/poll_button_container';
import UploadButtonContainer from '../containers/upload_button_container';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import SpoilerButtonContainer from '../containers/spoiler_button_container';
import MarkdownButtonContainer from '../containers/markdown_button_container';
import PrivacyDropdownContainer from '../containers/privacy_dropdown_container';
import EmojiPickerDropdown from '../containers/emoji_picker_dropdown_container';
import PollFormContainer from '../containers/poll_form_container';
import UploadFormContainer from '../containers/upload_form_container';
import WarningContainer from '../containers/warning_container';
import { isMobile } from '../../../is_mobile';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { length } from 'stringz';
import { countableText } from '../util/counter';
import Icon from 'soapbox/components/icon';
import { get } from 'lodash';
import UploadArea from 'soapbox/features/ui/components/upload_area';
import { uploadCompose } from 'soapbox/actions/compose';

const allowedAroundShortCode = '><\u0085\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\u0009\u000a\u000b\u000c\u000d';

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: 'What\'s on your mind?' },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Publish' },
  publishLoud: { id: 'compose_form.publish_loud', defaultMessage: '{publish}!' },
});

export default @connect()
@injectIntl
class ComposeForm extends ImmutablePureComponent {

  state = {
    composeFocused: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    suggestions: ImmutablePropTypes.list,
    spoiler: PropTypes.bool,
    sensitive: PropTypes.bool,
    privacy: PropTypes.string,
    spoilerText: PropTypes.string,
    focusDate: PropTypes.instanceOf(Date),
    caretPosition: PropTypes.number,
    isSubmitting: PropTypes.bool,
    isChangingUpload: PropTypes.bool,
    isUploading: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    onChangeSpoilerText: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired,
    onPickEmoji: PropTypes.func.isRequired,
    showSearch: PropTypes.bool,
    anyMedia: PropTypes.bool,
    shouldCondense: PropTypes.bool,
    autoFocus: PropTypes.bool,
    group: ImmutablePropTypes.map,
    isModalOpen: PropTypes.bool,
    clickableAreaRef: PropTypes.object,
  };

  static defaultProps = {
    showSearch: false,
  };

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  handleComposeFocus = () => {
    this.setState({
      composeFocused: true,
    });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
      e.preventDefault(); // Prevent bubbling to other ComposeForm instances
    }
  }

  getClickableArea = () => {
    const { clickableAreaRef } = this.props;
    return clickableAreaRef ? clickableAreaRef.current : this.form;
  }

  isClickOutside = (e) => {
    return ![
      // List of elements that shouldn't collapse the composer when clicked
      // FIXME: Make this less brittle
      this.getClickableArea(),
      document.querySelector('.privacy-dropdown__dropdown'),
      document.querySelector('.emoji-picker-dropdown__menu'),
      document.querySelector('.modal-root__overlay'),
    ].some(element => element && element.contains(e.target));
  }

  handleClick = (e) => {
    if (this.isClickOutside(e)) {
      this.handleClickOutside();
    }
  }

  handleClickOutside = () => {
    this.setState({
      composeFocused: false,
    });
  }

  handleSubmit = () => {
    if (this.props.text !== this.autosuggestTextarea.textarea.value) {
      // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
      // Update the state to match the current text
      this.props.onChange(this.autosuggestTextarea.textarea.value);
    }

    // Submit disabled:
    const { isSubmitting, isChangingUpload, isUploading, anyMedia, maxTootChars } = this.props;
    const fulltext = [this.props.spoilerText, countableText(this.props.text)].join('');

    if (isSubmitting || isUploading || isChangingUpload || length(fulltext) > maxTootChars || (fulltext.length !== 0 && fulltext.trim().length === 0 && !anyMedia)) {
      return;
    }

    this.props.onSubmit(this.context.router ? this.context.router.history : null, this.props.group);
  }

  onSuggestionsClearRequested = () => {
    this.props.onClearSuggestions();
  }

  onSuggestionsFetchRequested = (token) => {
    this.props.onFetchSuggestions(token);
  }

  onSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['text']);
  }

  onSpoilerSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['spoiler_text']);
  }

  handleChangeSpoilerText = (e) => {
    this.props.onChangeSpoilerText(e.target.value);
  }

  doFocus = () => {
    if (!this.autosuggestTextarea) return;
    this.autosuggestTextarea.textarea.focus();
  }

  setCursor = (start, end = start) => {
    if (!this.autosuggestTextarea) return;
    this.autosuggestTextarea.textarea.setSelectionRange(start, end);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, true);
    this.setCursor(this.props.text.length); // Set cursor at end
    const composeForm = document.getElementById('compose-form');
    composeForm.addEventListener('dragenter', this.handleDragEnter, false);
    composeForm.addEventListener('dragover', this.handleDragOver, false);
    composeForm.addEventListener('drop', this.handleDrop, false);
    composeForm.addEventListener('dragleave', this.handleDragLeave, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
    const composeForm = document.getElementById('compose-form');
    composeForm.removeEventListener('dragenter', this.handleDragEnter);
    composeForm.removeEventListener('dragover', this.handleDragOver);
    composeForm.removeEventListener('drop', this.handleDrop);
    composeForm.removeEventListener('dragleave', this.handleDragLeave);
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

  handleDrop = (e) => {
    if (this.dataTransferIsText(e.dataTransfer)) return;
    e.preventDefault();

    this.setState({ draggingOver: false });
    this.dragTargets = [];

    if (e.dataTransfer && e.dataTransfer.files.length >= 1) {
      this.props.dispatch(uploadCompose(e.dataTransfer.files));
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.form.contains(el));

    if (this.dragTargets.length > 0) {
      return;
    }

    this.setState({ draggingOver: false });
  }

  dataTransferIsText = (dataTransfer) => {
    return (dataTransfer && Array.from(dataTransfer.types).includes('text/plain') && dataTransfer.items.length === 1);
  }

  closeUploadModal = () => {
    this.setState({ draggingOver: false });
  }

  setAutosuggestTextarea = (c) => {
    this.autosuggestTextarea = c;
  }

  setForm = (c) => {
    this.form = c;
  }

  setSpoilerText = (c) => {
    this.spoilerText = c;
  }

  handleEmojiPick = (data) => {
    const { text }     = this.props;
    const position     = this.autosuggestTextarea.textarea.selectionStart;
    const needsSpace   = data.custom && position > 0 && !allowedAroundShortCode.includes(text[position - 1]);

    this.props.onPickEmoji(position, data, needsSpace);
  }

  focusSpoilerInput = () => {
    const spoilerInput = get(this, ['spoilerText', 'input']);
    if (spoilerInput) spoilerInput.focus();
  }

  focusTextarea = () => {
    const textarea = get(this, ['autosuggestTextarea', 'textarea']);
    if (textarea) textarea.focus();
  }

  maybeUpdateFocus = prevProps => {
    const spoilerUpdated = this.props.spoiler !== prevProps.spoiler;
    const sensitiveUpdated = this.props.sensitive !== prevProps.sensitive;
    const mediaUpdated = this.props.anyMedia !== prevProps.anyMedia;
    if (spoilerUpdated || sensitiveUpdated || mediaUpdated) {
      switch (this.props.spoiler) {
      case true: this.focusSpoilerInput(); break;
      case false: this.focusTextarea(); break;
      }
    }
  }

  componentDidUpdate(prevProps) {
    this.maybeUpdateFocus(prevProps);
  }

  render() {
    const { intl, onPaste, showSearch, anyMedia, shouldCondense, autoFocus, isModalOpen, maxTootChars } = this.props;
    const { draggingOver } = this.state;
    const condensed = shouldCondense && !this.props.text && !this.state.composeFocused;
    const disabled = this.props.isSubmitting;
    const text     = [this.props.spoilerText, countableText(this.props.text)].join('');
    const disabledButton = disabled || this.props.isUploading || this.props.isChangingUpload || length(text) > maxTootChars || (text.length !== 0 && text.trim().length === 0 && !anyMedia);
    const shouldAutoFocus = autoFocus && !showSearch && !isMobile(window.innerWidth);

    let publishText = '';

    if (this.props.privacy === 'private' || this.props.privacy === 'direct') {
      publishText = <span className='compose-form__publish-private'><Icon id='lock' /> {intl.formatMessage(messages.publish)}</span>;
    } else {
      publishText = this.props.privacy !== 'unlisted' ? intl.formatMessage(messages.publishLoud, { publish: intl.formatMessage(messages.publish) }) : intl.formatMessage(messages.publish);
    }

    const composeClassNames = classNames({
      'compose-form': true,
      'condensed': condensed,
    });

    return (
      <div className={composeClassNames} ref={this.setForm} onClick={this.handleClick} id='compose-form'>
        <WarningContainer />

        { !shouldCondense && <ReplyIndicatorContainer /> }

        <div className={`spoiler-input ${this.props.spoiler ? 'spoiler-input--visible' : ''}`}>
          <AutosuggestInput
            placeholder={intl.formatMessage(messages.spoiler_placeholder)}
            value={this.props.spoilerText}
            onChange={this.handleChangeSpoilerText}
            onKeyDown={this.handleKeyDown}
            disabled={!this.props.spoiler}
            ref={this.setSpoilerText}
            suggestions={this.props.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSpoilerSuggestionSelected}
            searchTokens={[':']}
            id='cw-spoiler-input'
            className='spoiler-input__input'
          />
        </div>

        <div className='emoji-picker-wrapper'>
          <EmojiPickerDropdown onPickEmoji={this.handleEmojiPick} />
        </div>
        <UploadArea active={draggingOver} onClose={this.closeUploadModal} />

        <AutosuggestTextarea
          ref={(isModalOpen && shouldCondense) ? null : this.setAutosuggestTextarea}
          placeholder={intl.formatMessage(messages.placeholder)}
          disabled={disabled}
          value={this.props.text}
          onChange={this.handleChange}
          suggestions={this.props.suggestions}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleComposeFocus}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          onPaste={onPaste}
          autoFocus={shouldAutoFocus}
        >
          {
            !condensed &&
            <div className='compose-form__modifiers'>
              <UploadFormContainer />
              <PollFormContainer />
            </div>
          }
        </AutosuggestTextarea>

        {
          !condensed &&
          <div className='compose-form__buttons-wrapper'>
            <div className='compose-form__buttons'>
              <UploadButtonContainer />
              <PollButtonContainer />
              <PrivacyDropdownContainer />
              <SpoilerButtonContainer />
              <MarkdownButtonContainer />
            </div>
            {maxTootChars && <div className='character-counter__wrapper'><CharacterCounter max={maxTootChars} text={text} /></div>}
            <div className='compose-form__publish'>
              <div className='compose-form__publish-button-wrapper'><Button text={publishText} onClick={this.handleSubmit} disabled={disabledButton} block /></div>
            </div>
          </div>
        }
      </div>
    );
  }

}

import classNames from 'classnames';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { length } from 'stringz';

import Icon from 'soapbox/components/icon';

import AutosuggestInput from '../../../components/autosuggest_input';
import AutosuggestTextarea from '../../../components/autosuggest_textarea';
import { Button } from '../../../components/ui';
import { isMobile } from '../../../is_mobile';
import ReplyMentions from '../components/reply_mentions';
import UploadForm from '../components/upload_form';
import Warning from '../components/warning';
import EmojiPickerDropdown from '../containers/emoji_picker_dropdown_container';
import MarkdownButtonContainer from '../containers/markdown_button_container';
import PollButtonContainer from '../containers/poll_button_container';
import PollFormContainer from '../containers/poll_form_container';
import PrivacyDropdownContainer from '../containers/privacy_dropdown_container';
import QuotedStatusContainer from '../containers/quoted_status_container';
import ReplyIndicatorContainer from '../containers/reply_indicator_container';
import ScheduleButtonContainer from '../containers/schedule_button_container';
import ScheduleFormContainer from '../containers/schedule_form_container';
import SpoilerButtonContainer from '../containers/spoiler_button_container';
import UploadButtonContainer from '../containers/upload_button_container';
import WarningContainer from '../containers/warning_container';
import { countableText } from '../util/counter';

import TextCharacterCounter from './text_character_counter';
import VisualCharacterCounter from './visual_character_counter';

const allowedAroundShortCode = '><\u0085\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\u0009\u000a\u000b\u000c\u000d';

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: 'What\'s on your mind?' },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Post' },
  publishLoud: { id: 'compose_form.publish_loud', defaultMessage: '{publish}!' },
  message: { id: 'compose_form.message', defaultMessage: 'Message' },
  schedule: { id: 'compose_form.schedule', defaultMessage: 'Schedule' },
  saveChanges: { id: 'compose_form.save_changes', defaultMessage: 'Save changes' },
});

export default @withRouter
class ComposeForm extends ImmutablePureComponent {

  state = {
    composeFocused: false,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    suggestions: ImmutablePropTypes.list,
    spoiler: PropTypes.bool,
    privacy: PropTypes.string,
    spoilerText: PropTypes.string,
    focusDate: PropTypes.instanceOf(Date),
    caretPosition: PropTypes.number,
    isSubmitting: PropTypes.bool,
    isChangingUpload: PropTypes.bool,
    isEditing: PropTypes.bool,
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
    scheduledAt: PropTypes.instanceOf(Date),
    features: PropTypes.object.isRequired,
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

  isEmpty = () => {
    const { text, spoilerText, anyMedia } = this.props;
    return !(text || spoilerText || anyMedia);
  }

  isClickOutside = (e) => {
    return ![
      // List of elements that shouldn't collapse the composer when clicked
      // FIXME: Make this less brittle
      this.getClickableArea(),
      document.querySelector('.privacy-dropdown__dropdown'),
      document.querySelector('.emoji-picker-dropdown__menu'),
      document.getElementById('modal-overlay'),
    ].some(element => element?.contains(e.target));
  }

  handleClick = (e) => {
    if (this.isEmpty() && this.isClickOutside(e)) {
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

    this.props.onSubmit(this.props.history ? this.props.history : null, this.props.group);
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

  setCursor = (start, end = start) => {
    if (!this.autosuggestTextarea) return;
    this.autosuggestTextarea.textarea.setSelectionRange(start, end);
  }

  componentDidMount() {
    const length = this.props.text.length;
    document.addEventListener('click', this.handleClick, true);

    if (length > 0) {
      this.setCursor(length); // Set cursor at end
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
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
    if (spoilerUpdated) {
      switch (this.props.spoiler) {
        case true: this.focusSpoilerInput(); break;
        case false: this.focusTextarea(); break;
      }
    }
  }

  maybeUpdateCursor = prevProps => {
    const shouldUpdate = [
      // Autosuggest has been updated and
      // the cursor position explicitly set
      this.props.focusDate !== prevProps.focusDate,
      typeof this.props.caretPosition === 'number',
    ].every(Boolean);

    if (shouldUpdate) {
      this.setCursor(this.props.caretPosition);
    }
  }

  componentDidUpdate(prevProps) {
    this.maybeUpdateFocus(prevProps);
    this.maybeUpdateCursor(prevProps);
  }

  render() {
    const { intl, onPaste, showSearch, anyMedia, shouldCondense, autoFocus, isModalOpen, maxTootChars, scheduledStatusCount, features } = this.props;
    const condensed = shouldCondense && !this.state.composeFocused && this.isEmpty() && !this.props.isUploading;
    const disabled = this.props.isSubmitting;
    const text     = [this.props.spoilerText, countableText(this.props.text)].join('');
    const disabledButton = disabled || this.props.isUploading || this.props.isChangingUpload || length(text) > maxTootChars || (text.length !== 0 && text.trim().length === 0 && !anyMedia);
    const shouldAutoFocus = autoFocus && !showSearch && !isMobile(window.innerWidth);

    let publishText = '';

    if (this.props.isEditing) {
      publishText = intl.formatMessage(messages.saveChanges);
    } else if (this.props.privacy === 'direct') {
      publishText = (
        <>
          <Icon src={require('@tabler/icons/icons/mail.svg')} />
          {intl.formatMessage(messages.message)}
        </>
      );
    } else if (this.props.privacy === 'private') {
      publishText = (
        <>
          <Icon src={require('@tabler/icons/icons/lock.svg')} />
          {intl.formatMessage(messages.publish)}
        </>
      );
    } else {
      publishText = this.props.privacy !== 'unlisted' ? intl.formatMessage(messages.publishLoud, { publish: intl.formatMessage(messages.publish) }) : intl.formatMessage(messages.publish);
    }

    if (this.props.scheduledAt) {
      publishText = intl.formatMessage(messages.schedule);
    }

    return (
      <div className='w-full' ref={this.setForm} onClick={this.handleClick}>
        {scheduledStatusCount > 0 && (
          <Warning
            message={(
              <FormattedMessage
                id='compose_form.scheduled_statuses.message'
                defaultMessage='You have scheduled posts. {click_here} to see them.'
                values={{ click_here: (
                  <Link to='/scheduled_statuses'>
                    <FormattedMessage
                      id='compose_form.scheduled_statuses.click_here'
                      defaultMessage='Click here'
                    />
                  </Link>
                ) }}
              />)
            }
          />
        )}

        <WarningContainer />

        {!shouldCondense && <ReplyIndicatorContainer />}

        {!shouldCondense && <ReplyMentions />}

        <div
          className={classNames({
            'relative transition-height': true,
            'hidden': !this.props.spoiler,
          })}
        >
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
            className='mb-2 border-none shadow-none px-0 py-2 text-base'
            autoFocus
          />
        </div>

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
          condensed={condensed}
          id='compose-textarea'
        >
          {
            !condensed &&
            <div className='compose-form__modifiers'>
              <UploadForm />
              <PollFormContainer />
              <ScheduleFormContainer />
            </div>
          }
        </AutosuggestTextarea>

        <QuotedStatusContainer />

        <div
          className={classNames('flex flex-wrap items-center justify-between', {
            'hidden': condensed,
          })}
        >
          <div className='flex items-center space-x-2'>
            {features.media && <UploadButtonContainer />}
            <EmojiPickerDropdown onPickEmoji={this.handleEmojiPick} />
            {features.polls && <PollButtonContainer />}
            {features.privacyScopes && <PrivacyDropdownContainer />}
            {features.scheduledStatuses && <ScheduleButtonContainer />}
            {features.spoilers && <SpoilerButtonContainer />}
            {features.richText && <MarkdownButtonContainer />}
          </div>

          <div className='flex items-center space-x-4 ml-auto'>
            {maxTootChars && (
              <div className='flex items-center space-x-1'>
                <TextCharacterCounter max={maxTootChars} text={text} />
                <VisualCharacterCounter max={maxTootChars} text={text} />
              </div>
            )}

            <Button theme='primary' text={publishText} onClick={this.handleSubmit} disabled={disabledButton} />
          </div>
        </div>
      </div>
    );
  }

}

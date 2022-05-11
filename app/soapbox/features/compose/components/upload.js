import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import spring from 'react-motion/lib/spring';
import { withRouter } from 'react-router-dom';

import Blurhash from 'soapbox/components/blurhash';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';

import Motion from '../../ui/util/optional_motion';

const bookIcon = require('@tabler/icons/icons/book.svg');
const fileAnalyticsIcon = require('@tabler/icons/icons/file-analytics.svg');
const fileCodeIcon = require('@tabler/icons/icons/file-code.svg');
const fileTextIcon = require('@tabler/icons/icons/file-text.svg');
const fileZipIcon = require('@tabler/icons/icons/file-zip.svg');
const presentationIcon = require('@tabler/icons/icons/presentation.svg');

export const MIMETYPE_ICONS = {
  'application/x-freearc': fileZipIcon,
  'application/x-bzip': fileZipIcon,
  'application/x-bzip2': fileZipIcon,
  'application/gzip': fileZipIcon,
  'application/vnd.rar': fileZipIcon,
  'application/x-tar': fileZipIcon,
  'application/zip': fileZipIcon,
  'application/x-7z-compressed': fileZipIcon,
  'application/x-csh': fileCodeIcon,
  'application/html': fileCodeIcon,
  'text/javascript': fileCodeIcon,
  'application/json': fileCodeIcon,
  'application/ld+json': fileCodeIcon,
  'application/x-httpd-php': fileCodeIcon,
  'application/x-sh': fileCodeIcon,
  'application/xhtml+xml': fileCodeIcon,
  'application/xml': fileCodeIcon,
  'application/epub+zip': bookIcon,
  'application/vnd.oasis.opendocument.spreadsheet': fileAnalyticsIcon,
  'application/vnd.ms-excel': fileAnalyticsIcon,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': fileAnalyticsIcon,
  'application/pdf': fileTextIcon,
  'application/vnd.oasis.opendocument.presentation': presentationIcon,
  'application/vnd.ms-powerpoint': presentationIcon,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': presentationIcon,
  'text/plain': fileTextIcon,
  'application/rtf': fileTextIcon,
  'application/msword': fileTextIcon,
  'application/x-abiword': fileTextIcon,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': fileTextIcon,
  'application/vnd.oasis.opendocument.text': fileTextIcon,
};

const messages = defineMessages({
  description: { id: 'upload_form.description', defaultMessage: 'Describe for the visually impaired' },
  delete: { id: 'upload_form.undo', defaultMessage: 'Delete' },
});

export default @injectIntl @withRouter
class Upload extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onUndo: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onOpenFocalPoint: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    hovered: false,
    focused: false,
    dirtyDescription: null,
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    this.handleInputBlur();
    this.props.onSubmit(this.props.history);
  }

  handleUndoClick = e => {
    e.stopPropagation();
    this.props.onUndo(this.props.media.get('id'));
  }

  handleFocalPointClick = e => {
    e.stopPropagation();
    this.props.onOpenFocalPoint(this.props.media.get('id'));
  }

  handleInputChange = e => {
    this.setState({ dirtyDescription: e.target.value });
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  }

  handleInputFocus = () => {
    this.setState({ focused: true });
  }

  handleClick = () => {
    this.setState({ focused: true });
  }

  handleInputBlur = () => {
    const { dirtyDescription } = this.state;

    this.setState({ focused: false, dirtyDescription: null });

    if (dirtyDescription !== null) {
      this.props.onDescriptionChange(this.props.media.get('id'), dirtyDescription);
    }
  }

  handleOpenModal = () => {
    this.props.onOpenModal(this.props.media);
  }

  render() {
    const { intl, media, descriptionLimit } = this.props;
    const active          = this.state.hovered || this.state.focused;
    const description     = this.state.dirtyDescription || (this.state.dirtyDescription !== '' && media.get('description')) || '';
    const focusX = media.getIn(['meta', 'focus', 'x']);
    const focusY = media.getIn(['meta', 'focus', 'y']);
    const x = ((focusX /  2) + .5) * 100;
    const y = ((focusY / -2) + .5) * 100;
    const mediaType = media.get('type');
    const uploadIcon = mediaType === 'unknown' && (
      <Icon
        className='h-16 w-16 mx-auto my-12 text-gray-800 dark:text-gray-200'
        src={MIMETYPE_ICONS[media.getIn(['pleroma', 'mime_type'])] || require('@tabler/icons/icons/paperclip.svg')}
      />
    );

    return (
      <div className='compose-form__upload' tabIndex='0' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleClick} role='button'>
        <Blurhash hash={media.get('blurhash')} className='media-gallery__preview' />
        <Motion defaultStyle={{ scale: 0.8 }} style={{ scale: spring(1, { stiffness: 180, damping: 12 }) }}>
          {({ scale }) => (
            <div
              className={classNames('compose-form__upload-thumbnail',  `${mediaType}`)}
              style={{
                transform: `scale(${scale})`,
                backgroundImage: mediaType === 'image' ? `url(${media.get('preview_url')})` : null,
                backgroundPosition: `${x}% ${y}%` }}
            >
              <div className={classNames('compose-form__upload__actions', { active })}>
                <IconButton
                  onClick={this.handleUndoClick}
                  src={require('@tabler/icons/icons/x.svg')}
                  text={<FormattedMessage id='upload_form.undo' defaultMessage='Delete' />}
                />

                {/* Only display the "Preview" button for a valid attachment with a URL */}
                {(mediaType !== 'unknown' && Boolean(media.get('url'))) && (
                  <IconButton
                    onClick={this.handleOpenModal}
                    src={require('@tabler/icons/icons/zoom-in.svg')}
                    text={<FormattedMessage id='upload_form.preview' defaultMessage='Preview' />}
                  />
                )}
              </div>

              <div className={classNames('compose-form__upload-description', { active })}>
                <label>
                  <span style={{ display: 'none' }}>{intl.formatMessage(messages.description)}</span>

                  <textarea
                    placeholder={intl.formatMessage(messages.description)}
                    value={description}
                    maxLength={descriptionLimit}
                    onFocus={this.handleInputFocus}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    onKeyDown={this.handleKeyDown}
                  />
                </label>
              </div>

              <div className='compose-form__upload-preview'>
                {mediaType === 'video' && (
                  <video autoPlay playsInline muted loop>
                    <source src={media.get('preview_url')} />
                  </video>
                )}
                {uploadIcon}
              </div>
            </div>
          )}
        </Motion>
      </div>
    );
  }

}

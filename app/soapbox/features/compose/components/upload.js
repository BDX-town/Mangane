import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Motion from '../../ui/util/optional_motion';
import spring from 'react-motion/lib/spring';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';
import Blurhash from 'soapbox/components/blurhash';

const MIMETYPE_ICONS = {
  'application/x-freearc': 'file-archive-o',
  'application/x-bzip': 'file-archive-o',
  'application/x-bzip2': 'file-archive-o',
  'application/gzip': 'file-archive-o',
  'application/vnd.rar': 'file-archive-o',
  'application/x-tar': 'file-archive-o',
  'application/zip': 'file-archive-o',
  'application/x-7z-compressed': 'file-archive-o',
  'application/x-csh': 'file-code-o',
  'application/html': 'file-code-o',
  'text/javascript': 'file-code-o',
  'application/json': 'file-code-o',
  'application/ld+json': 'file-code-o',
  'application/x-httpd-php': 'file-code-o',
  'application/x-sh': 'file-code-o',
  'application/xhtml+xml': 'file-code-o',
  'application/xml': 'file-code-o',
  'application/epub+zip': 'file-epub-o',
  'application/vnd.oasis.opendocument.spreadsheet': 'file-excel-o',
  'application/vnd.ms-excel': 'file-excel-o',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file-excel-o',
  'application/pdf': 'file-pdf-o',
  'application/vnd.oasis.opendocument.presentation': 'file-powerpoint-o',
  'application/vnd.ms-powerpoint': 'file-powerpoint-o',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'file-powerpoint-o',
  'text/plain': 'file-text-o',
  'application/rtf': 'file-text-o',
  'application/msword': 'file-word-o',
  'application/x-abiword': 'file-word-o',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file-word-o',
  'application/vnd.oasis.opendocument.text': 'file-word-o',
};

const messages = defineMessages({
  description: { id: 'upload_form.description', defaultMessage: 'Describe for the visually impaired' },
  delete: { id: 'upload_form.undo', defaultMessage: 'Delete' },
});

export default @injectIntl
class Upload extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    media: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onUndo: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onOpenFocalPoint: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
    this.props.onSubmit(this.context.router.history);
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
        id={MIMETYPE_ICONS[media.getIn(['pleroma', 'mime_type'])] || 'paperclip'}
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
                backgroundImage: mediaType === 'image' ? `url(${media.get('preview_url')})`: null,
                backgroundPosition: `${x}% ${y}%` }}
            >
              <div className={classNames('compose-form__upload__actions', { active })}>
                <button className='icon-button' onClick={this.handleUndoClick}><Icon id='times' /> <FormattedMessage id='upload_form.undo' defaultMessage='Delete' /></button>
                {mediaType !== 'unknown' && <button className='icon-button' onClick={this.handleOpenModal}><Icon id='search-plus' /> <FormattedMessage id='upload_form.preview' defaultMessage='Preview' /></button>}
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

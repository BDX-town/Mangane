import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import IconButton from '../../../components/icon_button';

const messages = defineMessages({
  upload: { id: 'upload_button.label', defaultMessage: 'Add media attachment' },
});

const onlyImages = types => {
  return Boolean(types && types.every(type => type.startsWith('image/')));
};

const makeMapStateToProps = () => {
  const mapStateToProps = state => ({
    attachmentTypes: state.getIn(['instance', 'configuration', 'media_attachments', 'supported_mime_types']),
  });

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class UploadButton extends ImmutablePureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    unavailable: PropTypes.bool,
    onSelectFile: PropTypes.func.isRequired,
    style: PropTypes.object,
    resetFileKey: PropTypes.number,
    attachmentTypes: ImmutablePropTypes.listOf(PropTypes.string),
    intl: PropTypes.object.isRequired,
  };

  handleChange = (e) => {
    if (e.target.files.length > 0) {
      this.props.onSelectFile(e.target.files);
    }
  }

  handleClick = () => {
    this.fileElement.click();
  }

  setRef = (c) => {
    this.fileElement = c;
  }

  render() {
    const { intl, resetFileKey, attachmentTypes, unavailable, disabled } = this.props;

    if (unavailable) {
      return null;
    }

    const src = onlyImages(attachmentTypes)
      ? require('@tabler/icons/icons/photo.svg')
      : require('@tabler/icons/icons/paperclip.svg');

    return (
      <div className='compose-form__upload-button'>
        <IconButton
          className='compose-form__upload-button-icon'
          src={src}
          title={intl.formatMessage(messages.upload)}
          disabled={disabled}
          onClick={this.handleClick}
        />
        <label>
          <span style={{ display: 'none' }}>{intl.formatMessage(messages.upload)}</span>
          <input
            key={resetFileKey}
            ref={this.setRef}
            type='file'
            multiple
            accept={attachmentTypes && attachmentTypes.toArray().join(',')}
            onChange={this.handleChange}
            disabled={disabled}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    );
  }

}

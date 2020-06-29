import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Audio from 'soapbox/features/audio';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';

export const previewState = 'previewAudioModal';

export default class AudioModal extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.map.isRequired,
    status: ImmutablePropTypes.map,
    time: PropTypes.number,
    onClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleStatusClick = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(`/@${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('id')}`);
    }
  }

  render() {
    const { media, status, time, onClose } = this.props;

    const link = status && <a href={status.get('url')} onClick={this.handleStatusClick}><FormattedMessage id='lightbox.view_context' defaultMessage='View context' /></a>;

    return (
      <div className='modal-root__modal audio-modal'>
        <div>
          <Audio
            src={media.get('url')}
            startTime={time}
            onCloseAudio={onClose}
            link={link}
            detailed
            alt={media.get('description')}
          />
        </div>
      </div>
    );
  }

}

import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';

import Video from 'soapbox/features/video';

export default class VideoModal extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.map.isRequired,
    status: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    time: PropTypes.number,
    onClose: PropTypes.func.isRequired,
  };

  handleStatusClick = e => {
    const { status, account } = this.props;
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(`/@${account.get('acct')}/posts/${status.get('id')}`);
    }
  }

  render() {
    const { media, status, account, time, onClose } = this.props;

    const link = status && account && <a href={status.get('url')} onClick={this.handleStatusClick}><FormattedMessage id='lightbox.view_context' defaultMessage='View context' /></a>;

    return (
      <div className='modal-root__modal video-modal'>
        <div>
          <Video
            preview={media.get('preview_url')}
            blurhash={media.get('blurhash')}
            src={media.get('url')}
            startTime={time}
            onCloseVideo={onClose}
            link={link}
            detailed
            alt={media.get('description')}
          />
        </div>
      </div>
    );
  }

}

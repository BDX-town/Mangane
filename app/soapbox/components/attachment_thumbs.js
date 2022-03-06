import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import Bundle from 'soapbox/features/ui/components/bundle';
import { MediaGallery } from 'soapbox/features/ui/util/async-components';

export default @connect()
class AttachmentThumbs extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    media: ImmutablePropTypes.list.isRequired,
    onClick: PropTypes.func,
    sensitive: PropTypes.bool,
  };

  renderLoading() {
    return <div className='media-gallery--compact' />;
  }

  onOpenMedia = (media, index) => {
    this.props.dispatch(openModal('MEDIA', { media, index }));
  }

  render() {
    const { media, onClick, sensitive } = this.props;

    return (
      <div className='attachment-thumbs'>
        <Bundle fetchComponent={MediaGallery} loading={this.renderLoading}>
          {Component => (
            <Component
              media={media}
              onOpenMedia={this.onOpenMedia}
              height={50}
              compact
              sensitive={sensitive}
            />
          )}
        </Bundle>
        {onClick && (
          <div className='attachment-thumbs__clickable-region' onClick={onClick} />
        )}
      </div>
    );
  }

}

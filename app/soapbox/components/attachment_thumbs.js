import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { MediaGallery } from 'soapbox/features/ui/util/async-components';
import { openModal } from 'soapbox/actions/modal';
import Bundle from 'soapbox/features/ui/components/bundle';

export default @connect()
class AttachmentThumbs extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    media: ImmutablePropTypes.list.isRequired,
  };

  renderLoading() {
    return <div className='media-gallery--compact' />;
  }

  onOpenMedia = (media, index) => {
    this.props.dispatch(openModal('MEDIA', { media, index }));
  }

  render() {
    const { media } = this.props;

    return (
      <Bundle fetchComponent={MediaGallery} loading={this.renderLoading}>
        {Component => (
          <Component
            media={media}
            onOpenMedia={this.onOpenMedia}
            height={50}
            compact
          />
        )}
      </Bundle>
    );
  }

}

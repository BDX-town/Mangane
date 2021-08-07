import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import StatusContent from 'soapbox/components/status_content';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import { openModal } from 'soapbox/actions/modal';
import noop from 'lodash/noop';
import { MediaGallery, Video, Audio } from 'soapbox/features/ui/util/async-components';
import Bundle from 'soapbox/features/ui/components/bundle';
import { deleteStatusModal } from 'soapbox/actions/moderation';

const messages = defineMessages({
  viewStatus: { id: 'admin.reports.actions.view_status', defaultMessage: 'View post' },
  deleteStatus: { id: 'admin.statuses.actions.delete_status', defaultMessage: 'Delete post' },
});

export default @connect()
@injectIntl
class ReportStatus extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    report: ImmutablePropTypes.map,
  };

  makeMenu = () => {
    const { intl, status } = this.props;
    const acct = status.getIn(['account', 'acct']);

    return [{
      text: intl.formatMessage(messages.viewStatus, { acct: `@${acct}` }),
      to: `/@${acct}/posts/${status.get('id')}`,
    }, {
      text: intl.formatMessage(messages.deleteStatus, { acct: `@${acct}` }),
      action: this.handleDeleteStatus,
    }];
  }

  getMedia = () => {
    const { status } = this.props;

    if (status.get('media_attachments').size > 0) {
      if (status.get('media_attachments').some(item => item.get('type') === 'unknown')) {
        // Do nothing
      } else if (status.getIn(['media_attachments', 0, 'type']) === 'video') {
        const video = status.getIn(['media_attachments', 0]);

        return (
          <Bundle fetchComponent={Video} loading={this.renderLoadingVideoPlayer} >
            {Component => (
              <Component
                preview={video.get('preview_url')}
                blurhash={video.get('blurhash')}
                src={video.get('url')}
                alt={video.get('description')}
                aspectRatio={video.getIn(['meta', 'original', 'aspect'])}
                width={239}
                height={110}
                inline
                sensitive={status.get('sensitive')}
                onOpenVideo={noop}
              />
            )}
          </Bundle>
        );
      } else if (status.getIn(['media_attachments', 0, 'type']) === 'audio') {
        const audio = status.getIn(['media_attachments', 0]);

        return (
          <Bundle fetchComponent={Audio} loading={this.renderLoadingAudioPlayer} >
            {Component => (
              <Component
                src={audio.get('url')}
                alt={audio.get('description')}
                inline
                sensitive={status.get('sensitive')}
                onOpenAudio={noop}
              />
            )}
          </Bundle>
        );
      } else {
        return (
          <Bundle fetchComponent={MediaGallery} loading={this.renderLoadingMediaGallery} >
            {Component => <Component media={status.get('media_attachments')} sensitive={status.get('sensitive')} height={110} onOpenMedia={this.handleOpenMedia} />}
          </Bundle>
        );
      }
    }

    return null;
  }

  handleOpenMedia = (media, index) => {
    const { dispatch } = this.props;
    dispatch(openModal('MEDIA', { media, index }));
  }

  handleDeleteStatus = () => {
    const { intl, dispatch, status } = this.props;
    const statusId = status.get('id');
    dispatch(deleteStatusModal(intl, statusId));
  }

  render() {
    const { status } = this.props;
    const media = this.getMedia();
    const menu = this.makeMenu();

    return (
      <div className='admin-report__status'>
        <div className='admin-report__status-content'>
          <StatusContent status={status} />
          {media}
        </div>
        <div className='admin-report__status-actions'>
          <DropdownMenu items={menu} icon='ellipsis-v' size={18} direction='right' />
        </div>
      </div>
    );
  }

}

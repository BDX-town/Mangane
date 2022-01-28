import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modal';
import Icon from 'soapbox/components/icon';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import { getAccountGallery } from 'soapbox/selectors';

import { expandAccountMediaTimeline } from '../../../actions/timelines';
import MediaItem from '../../account_gallery/components/media_item';

class ProfileMediaPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    attachments: ImmutablePropTypes.list,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
  }

  handleOpenMedia = attachment => {
    if (attachment.get('type') === 'video') {
      this.props.dispatch(openModal('VIDEO', { media: attachment, status: attachment.get('status') }));
    } else {
      const media = attachment.getIn(['status', 'media_attachments']);
      const index = media.findIndex(x => x.get('id') === attachment.get('id'));

      this.props.dispatch(openModal('MEDIA', { media, index, status: attachment.get('status'), account: attachment.get('account') }));
    }
  }

  fetchMedia = () => {
    const { account } = this.props;

    if (account) {
      const accountId = account.get('id');

      this.props.dispatch(expandAccountMediaTimeline(accountId))
        .then(() => this.setState({ isLoading: false }))
        .catch(() => {});

    }
  }

  componentDidMount() {
    this.fetchMedia();
  }

  componentDidUpdate(prevProps) {
    const oldId = prevProps.account && prevProps.account.get('id');
    const newId = this.props.account && this.props.account.get('id');

    if (newId !== oldId) {
      this.setState({ isLoading: true });
      this.fetchMedia();
    }
  }

  renderAttachments() {
    const { attachments } = this.props;
    const publicAttachments = attachments.filter(attachment => attachment.getIn(['status', 'visibility']) === 'public');
    const nineAttachments = publicAttachments.slice(0, 9);

    if (!nineAttachments.isEmpty()) {
      return (
        <div className='media-panel__list'>
          {nineAttachments.map((attachment, index) => (
            <MediaItem
              key={`${attachment.getIn(['status', 'id'])}+${attachment.get('id')}`}
              attachment={attachment}
              displayWidth={255}
              onOpenMedia={this.handleOpenMedia}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className='media-panel__empty'>
          <FormattedMessage id='media_panel.empty_message' defaultMessage='No media found.' />
        </div>
      );
    }
  }

  render() {
    const { account } = this.props;
    const { isLoading } = this.state;

    return (
      <div className='media-panel'>
        <div className='media-panel-header'>
          <Icon src={require('@tabler/icons/icons/camera.svg')} className='media-panel-header__icon' />
          <span className='media-panel-header__label'>
            <FormattedMessage id='media_panel.title' defaultMessage='Media' />
          </span>
        </div>
        {account &&
          <div className='media-panel__content'>
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              this.renderAttachments()
            )}
          </div>
        }
      </div>
    );
  }

}

const mapStateToProps = (state, { account }) => ({
  attachments: getAccountGallery(state, account.get('id')),
});

export default injectIntl(
  connect(mapStateToProps, null, null, {
    forwardRef: true,
  },
  )(ProfileMediaPanel));

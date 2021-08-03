import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getAccountGallery } from 'soapbox/selectors';
import { openModal } from 'soapbox/actions/modal';
import { expandAccountMediaTimeline } from '../../../actions/timelines';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import MediaItem from '../../account_gallery/components/media_item';
import Icon from 'soapbox/components/icon';

class ProfileMediaPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    attachments: ImmutablePropTypes.list,
    dispatch: PropTypes.func.isRequired,
  };

  handleOpenMedia = attachment => {
    if (attachment.get('type') === 'video') {
      this.props.dispatch(openModal('VIDEO', { media: attachment, status: attachment.get('status') }));
    } else {
      const media = attachment.getIn(['status', 'media_attachments']);
      const index = media.findIndex(x => x.get('id') === attachment.get('id'));

      this.props.dispatch(openModal('MEDIA', { media, index, status: attachment.get('status'), account: attachment.get('account') }));
    }
  }

  componentDidMount() {
    const { account } = this.props;
    const accountId = account.get('id');
    this.props.dispatch(expandAccountMediaTimeline(accountId));
  }

  render() {
    const { attachments, account } = this.props;
    const publicAttachments = attachments.filter(attachment => attachment.getIn(['status', 'visibility']) === 'public');
    const nineAttachments = publicAttachments.slice(0, 9);

    return (
      <div className='media-panel'>
        <div className='media-panel-header'>
          <Icon id='camera' className='media-panel-header__icon' />
          <span className='media-panel-header__label'>
            <FormattedMessage id='media_panel.title' defaultMessage='Media' />
          </span>
        </div>
        {account &&
          <div className='media-panel__content'>
            <div className='media-panel__list'>
              {!nineAttachments.isEmpty() && nineAttachments.map((attachment, index) => (
                <MediaItem
                  key={`${attachment.getIn(['status', 'id'])}+${attachment.get('id')}`}
                  attachment={attachment}
                  displayWidth={255}
                  onOpenMedia={this.handleOpenMedia}
                />
              ))}
            </div>
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

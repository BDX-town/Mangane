import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

import AttachmentThumbs from 'soapbox/components/attachment_thumbs';

import Avatar from '../../../components/avatar';
import DisplayName from '../../../components/display_name';
import IconButton from '../../../components/icon_button';
import { isRtl } from '../../../rtl';

const messages = defineMessages({
  cancel: { id: 'reply_indicator.cancel', defaultMessage: 'Cancel' },
});

export default @injectIntl
class ReplyIndicator extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    onCancel: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleClick = () => {
    this.props.onCancel();
  }

  render() {
    const { status, intl } = this.props;

    if (!status) {
      return null;
    }

    const content = { __html: status.get('contentHtml') };
    const style   = {
      direction: isRtl(status.get('search_index')) ? 'rtl' : 'ltr',
    };

    return (
      <div className='reply-indicator'>
        <div className='reply-indicator__header'>
          <div className='reply-indicator__cancel'>
            <IconButton title={intl.formatMessage(messages.cancel)} src={require('@tabler/icons/icons/x.svg')} onClick={this.handleClick} inverted />
          </div>

          <NavLink to={`/@${status.getIn(['account', 'acct'])}`} className='reply-indicator__display-name'>
            <div className='reply-indicator__display-avatar'><Avatar account={status.get('account')} size={24} /></div>
            <DisplayName account={status.get('account')} />
          </NavLink>
        </div>

        <div className='reply-indicator__content' style={style} dangerouslySetInnerHTML={content} />

        {status.get('media_attachments').size > 0 && (
          <AttachmentThumbs
            compact
            media={status.get('media_attachments')}
            sensitive={status.get('sensitive')}
          />
        )}
      </div>
    );
  }

}

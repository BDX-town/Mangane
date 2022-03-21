import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { NavLink, withRouter } from 'react-router-dom';

import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import IconButton from 'soapbox/components/icon_button';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import { isRtl } from 'soapbox/rtl';

const messages = defineMessages({
  cancel: { id: 'reply_indicator.cancel', defaultMessage: 'Cancel' },
});

export default @injectIntl @withRouter
class QuotedStatus extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    onCancel: PropTypes.func,
    intl: PropTypes.object.isRequired,
    compose: PropTypes.bool,
    history: PropTypes.object,
  };

  handleExpandClick = e => {
    const { compose, status } = this.props;

    if (!compose && e.button === 0) {
      if (!this.props.history) {
        return;
      }

      this.props.history.push(`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`);

      e.preventDefault();
    }
  }

  handleClose = e => {
    this.props.onCancel();

    e.preventDefault();
  }

  renderReplyMentions = () => {
    const { status } = this.props;

    if (!status.get('in_reply_to_id')) {
      return null;
    }

    const to = status.get('mentions', []);

    if (to.size === 0) {
      if (status.get('in_reply_to_account_id') === status.getIn(['account', 'id'])) {
        return (
          <div className='reply-mentions'>
            <FormattedMessage
              id='reply_mentions.reply'
              defaultMessage='Replying to {accounts}{more}'
              values={{
                accounts: `@${status.getIn(['account', 'username'])}`,
                more: false,
              }}
            />
          </div>
        );
      } else {
        return (
          <div className='reply-mentions'>
            <FormattedMessage id='reply_mentions.reply_empty' defaultMessage='Replying to post' />
          </div>
        );
      }
    }

    return (
      <div className='reply-mentions'>
        <FormattedMessage
          id='reply_mentions.reply'
          defaultMessage='Replying to {accounts}{more}'
          values={{
            accounts: to.slice(0, 2).map(account => `@${account.get('username')} `),
            more: to.size > 2 && <FormattedMessage id='reply_mentions.more' defaultMessage='and {count} more' values={{ count: to.size - 2 }} />,
          }}
        />
      </div>
    );
  }

  render() {
    const { status, onCancel, intl, compose } = this.props;

    if (!status) {
      return null;
    }

    const content = { __html: status.get('contentHtml') };
    const style   = {
      direction: isRtl(status.get('search_index')) ? 'rtl' : 'ltr',
    };

    const displayName = (<>
      <div className='quoted-status__display-avatar'><Avatar account={status.get('account')} size={24} /></div>
      <DisplayName account={status.get('account')} />
    </>);

    const quotedStatus = (
      <div className='quoted-status' onClick={this.handleExpandClick} role='presentation'>
        <div className='quoted-status__info'>
          {onCancel
            ? (
              <div className='reply-indicator__cancel'>
                <IconButton title={intl.formatMessage(messages.cancel)} src={require('@tabler/icons/icons/x.svg')} onClick={this.handleClose} inverted />
              </div>
            ) : (
              <div className='quoted-status__relative-time'>
                <RelativeTimestamp timestamp={status.get('created_at')} />
              </div>
            )}
          {compose ? (
            <div className='quoted-status__display-name'>
              {displayName}
            </div>
          ) : (
            <NavLink to={`/@${status.getIn(['account', 'acct'])}`} className='quoted-status__display-name'>
              {displayName}
            </NavLink>
          )}
        </div>

        {this.renderReplyMentions()}

        <div className='quoted-status__content' style={style} dangerouslySetInnerHTML={content} />

        {status.get('media_attachments').size > 0 && (
          <AttachmentThumbs
            compact
            media={status.get('media_attachments')}
            sensitive={status.get('sensitive')}
          />
        )}
      </div>
    );

    if (compose) {
      return (
        <div className='compose-form__quoted-status-wrapper'>
          {quotedStatus}
        </div>
      );
    }

    return quotedStatus;
  }

}

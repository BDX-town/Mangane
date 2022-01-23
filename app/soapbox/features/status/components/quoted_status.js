import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import { isRtl } from 'soapbox/rtl';
import { makeGetStatus } from 'soapbox/selectors';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => ({
    status: getStatus(state, { id: props.statusId }),
  });

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class QuotedStatus extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
  };

  handleExpandClick = (e) => {
    if (e.button === 0) {
      if (!this.context.router) {
        return;
      }

      this.context.router.history.push(`/@${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('id')}`);
    }
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
    const { status } = this.props;

    if (!status) {
      return null;
    }

    const content = { __html: status.get('contentHtml') };
    const style   = {
      direction: isRtl(status.get('search_index')) ? 'rtl' : 'ltr',
    };

    return (
      <div className='quoted-status' onClick={this.handleExpandClick} role='presentation'>
        <div className='quoted-status__info'>
          <div className='quoted-status__relative-time'>
            <RelativeTimestamp timestamp={status.get('created_at')} />
          </div>
          <NavLink to={`/@${status.getIn(['account', 'acct'])}`} className='quoted-status__display-name'>
            <div className='quoted-status__display-avatar'><Avatar account={status.get('account')} size={24} /></div>
            <DisplayName account={status.get('account')} />
          </NavLink>
        </div>

        {this.renderReplyMentions()}

        <div className='quoted-status__content' style={style} dangerouslySetInnerHTML={content} />

        {status.get('media_attachments').size > 0 && (
          <AttachmentThumbs
            compact
            media={status.get('media_attachments')}
          />
        )}
      </div>
    );
  }

}

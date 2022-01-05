import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';

export default @injectIntl
class StatusReplyMentions extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { status } = this.props;

    if (!status.get('in_reply_to_id')) {
      return null;
    }

    const to = status.get('mentions', []);

    // The post is a reply, but it has no mentions.
    if (to.size === 0) {
      // The author is replying to themself.
      if (status.get('in_reply_to_account_id') === status.getIn(['account', 'id'])) {
        return (
          <div className='reply-mentions'>
            <FormattedMessage
              id='reply_mentions.reply'
              defaultMessage='Replying to {accounts}{more}'
              values={{
                accounts: (<>
                  <HoverRefWrapper accountId={status.getIn(['account', 'id'])} inline>
                    <Link to={`/@${status.getIn(['account', 'acct'])}`} className='reply-mentions__account'>@{status.getIn(['account', 'username'])}</Link>
                  </HoverRefWrapper>
                </>),
                more: false,
              }}
            />
          </div>
        );
      } else {
        // The reply-to is unknown. Rare, but it can happen.
        return (
          <div className='reply-mentions'>
            <FormattedMessage
              id='reply_mentions.reply_empty'
              defaultMessage='Replying to post'
            />
          </div>
        );
      }
    }

    // The typical case with a reply-to and a list of mentions.
    return (
      <div className='reply-mentions'>
        <FormattedMessage
          id='reply_mentions.reply'
          defaultMessage='Replying to {accounts}{more}'
          values={{
            accounts: to.slice(0, 2).map(account => (<>
              <HoverRefWrapper accountId={account.get('id')} inline>
                <Link to={`/@${account.get('acct')}`} className='reply-mentions__account'>@{account.get('username')}</Link>
              </HoverRefWrapper>
              {' '}
            </>)),
            more: to.size > 2 && (
              <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}/mentions`}>
                <FormattedMessage id='reply_mentions.more' defaultMessage='and {count} more' values={{ count: to.size - 2 }} />
              </Link>
            ),
          }}
        />
      </div>
    );
  }

}

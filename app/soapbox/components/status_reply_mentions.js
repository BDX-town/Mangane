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

    const to = status.get('mentions', []);

    if (!status.get('in_reply_to_id') || !to || to.size === 0) {
      return null;
    }

    return (
      <div className='reply-mentions'>
        <FormattedMessage
          id='reply_mentions.reply'
          defaultMessage='Replying to {accounts}{more}'
          values={{
            accounts: to.slice(0, 2).map(account => (<>
              <HoverRefWrapper accountId={account.get('id')} inline>
                <Link to={`/@${account.get('acct')}`} className='reply-mentions__account'>@{account.get('acct').split('@')[0]}</Link>
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
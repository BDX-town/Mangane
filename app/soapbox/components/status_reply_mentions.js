import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modal';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';

const mapDispatchToProps = (dispatch) => ({
  onOpenMentionsModal(username, statusId) {
    dispatch(openModal('MENTIONS', {
      username,
      statusId,
    }));
  },
});

export default @connect(null, mapDispatchToProps)
@injectIntl
class StatusReplyMentions extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onOpenMentionsModal: PropTypes.func,
  }

  handleOpenMentionsModal = () => {
    const { status, onOpenMentionsModal } = this.props;

    onOpenMentionsModal(status.getIn(['account', 'acct']), status.get('id'));
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
              <span type='button' role='presentation' onClick={this.handleOpenMentionsModal}>
                <FormattedMessage id='reply_mentions.more' defaultMessage='and {count} more' values={{ count: to.size - 2 }} />
              </span>
            ),
          }}
        />
      </div>
    );
  }

}

import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';

export default @injectIntl
class ReplyMentions extends ImmutablePureComponent {

  static propTypes = {
    onOpenMentionsModal: PropTypes.func.isRequired,
    explicitAddressing: PropTypes.bool,
    to: ImmutablePropTypes.orderedSet,
    isReply: PropTypes.bool,
  };

  handleClick = e => {
    e.preventDefault();

    this.props.onOpenMentionsModal();
  }

  render() {
    const { explicitAddressing, to, isReply } = this.props;

    if (!explicitAddressing || !isReply || !to || to.size === 0) {
      return null;
    }

    return (
      <a href='#' className='reply-mentions' onClick={this.handleClick}>
        <FormattedMessage
          id='reply_mentions.reply'
          defaultMessage='Replying to {accounts}{more}'
          values={{
            accounts: to.slice(0, 2).map(acct => <><span className='reply-mentions__account'>@{acct.split('@')[0]}</span>{' '}</>),
            more: to.size > 2 && <FormattedMessage id='reply_mentions.more' defaultMessage='and {count} more' values={{ count: to.size - 2 }} />,
          }}
        />
      </a>
    );
  }

}

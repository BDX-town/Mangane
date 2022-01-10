import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { fetchAccount } from 'soapbox/actions/accounts';
import { addToMentions, removeFromMentions } from 'soapbox/actions/compose';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import IconButton from 'soapbox/components/icon_button';
import { makeGetAccount } from 'soapbox/selectors';

const messages = defineMessages({
  remove: { id: 'reply_mentions.account.remove', defaultMessage: 'Remove from mentions' },
  add: { id: 'reply_mentions.account.add', defaultMessage: 'Add to mentions' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => {
    const account = getAccount(state, accountId);

    return {
      added: !!account && state.getIn(['compose', 'to']).includes(account.get('acct')),
      account,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { accountId }) => ({
  onRemove: () => dispatch(removeFromMentions(accountId)),
  onAdd: () => dispatch(addToMentions(accountId)),
  fetchAccount: () => dispatch(fetchAccount(accountId)),
});

export default @connect(makeMapStateToProps, mapDispatchToProps)
@injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    accountId: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    added: PropTypes.bool,
    author: PropTypes.bool,
  };

  static defaultProps = {
    added: false,
  };

  componentDidMount() {
    const { account, accountId } = this.props;

    if (accountId && !account) {
      this.props.fetchAccount(accountId);
    }
  }

  render() {
    const { account, intl, onRemove, onAdd, added, author } = this.props;

    if (!account) return null;

    let button;

    if (added) {
      button = <IconButton src={require('@tabler/icons/icons/x.svg')} title={intl.formatMessage(messages.remove)} onClick={onRemove} />;
    } else {
      button = <IconButton src={require('@tabler/icons/icons/plus.svg')} title={intl.formatMessage(messages.add)} onClick={onAdd} />;
    }

    return (
      <div className='account'>
        <div className='account__wrapper'>
          <div className='account__display-name'>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
            <DisplayName account={account} />
          </div>

          <div className='account__relationship'>
            {!author && button}
          </div>
        </div>
      </div>
    );
  }

}

import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';

import Avatar from '../../../components/avatar';
import DisplayName from '../../../components/display_name';
import IconButton from '../../../components/icon_button';
import Permalink from '../../../components/permalink';

const messages = defineMessages({
  authorize: { id: 'follow_request.authorize', defaultMessage: 'Authorize' },
  reject: { id: 'follow_request.reject', defaultMessage: 'Reject' },
});

export default @injectIntl
class AccountAuthorize extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl, account, onAuthorize, onReject } = this.props;
    const content = { __html: account.get('note_emojified') };

    return (
      <div className='account-authorize__wrapper'>
        <div className='account-authorize'>
          <Permalink href={`/@${account.get('acct')}`} to={`/@${account.get('acct')}`} className='detailed-status__display-name'>
            <div className='account-authorize__avatar'><Avatar account={account} size={48} /></div>
            <DisplayName account={account} />
          </Permalink>

          <div className='account__header__content' dangerouslySetInnerHTML={content} />
        </div>

        <div className='account--panel'>
          <div className='account--panel__button'><IconButton title={intl.formatMessage(messages.authorize)} src={require('@tabler/icons/icons/check.svg')} onClick={onAuthorize} /></div>
          <div className='account--panel__button'><IconButton title={intl.formatMessage(messages.reject)} src={require('@tabler/icons/icons/x.svg')} onClick={onReject} /></div>
        </div>
      </div>
    );
  }

}

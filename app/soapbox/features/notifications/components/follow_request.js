import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';

import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import IconButton from 'soapbox/components/icon_button';
import Permalink from 'soapbox/components/permalink';

const messages = defineMessages({
  authorize: { id: 'follow_request.authorize', defaultMessage: 'Authorize' },
  reject: { id: 'follow_request.reject', defaultMessage: 'Reject' },
});

export default @injectIntl
class FollowRequest extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl, hidden, account, onAuthorize, onReject } = this.props;

    if (!account) {
      return <div />;
    }

    if (hidden) {
      return (
        <Fragment>
          {account.get('display_name')}
          {account.get('username')}
        </Fragment>
      );
    }

    return (
      <div className='account'>
        <div className='account__wrapper'>
          <Permalink key={account.get('id')} className='account__display-name' title={account.get('acct')} href={account.get('url')} to={`/@${account.get('acct')}`}>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
            <DisplayName account={account} />
          </Permalink>

          <div className='account__relationship'>
            <IconButton title={intl.formatMessage(messages.authorize)} src={require('@tabler/icons/icons/check.svg')} onClick={onAuthorize} />
            <IconButton title={intl.formatMessage(messages.reject)} src={require('@tabler/icons/icons/x.svg')} onClick={onReject} />
          </div>
        </div>
      </div>
    );
  }

}

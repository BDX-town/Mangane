import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { shortNumberFormat } from 'soapbox/utils/numbers';

import { HStack, Text } from '../../../components/ui';

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
});

export default @injectIntl
class ProfileStats extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    className: PropTypes.string,
    onClickHandler: PropTypes.func,
  }

  render() {
    const { intl } = this.props;
    const { account, onClickHandler } = this.props;

    if (!account) {
      return null;
    }

    const acct = account.get('acct');

    return (
      <HStack alignItems='center' space={3}>
        <NavLink to={`/@${acct}/followers`} onClick={onClickHandler} title={intl.formatNumber(account.get('followers_count'))}>
          <HStack alignItems='center' space={1}>
            <Text theme='primary' weight='bold' size='sm'>
              {shortNumberFormat(account.get('followers_count'))}
            </Text>
            <Text weight='bold' size='sm'>
              {intl.formatMessage(messages.followers)}
            </Text>
          </HStack>
        </NavLink>

        <NavLink to={`/@${acct}/following`} onClick={onClickHandler} title={intl.formatNumber(account.get('following_count'))}>
          <HStack alignItems='center' space={1}>
            <Text theme='primary' weight='bold' size='sm'>
              {shortNumberFormat(account.get('following_count'))}
            </Text>
            <Text weight='bold' size='sm'>
              {intl.formatMessage(messages.follows)}
            </Text>
          </HStack>
        </NavLink>
      </HStack>
    );
  }

}

import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Avatar from 'soapbox/components/avatar';
import StillImage from 'soapbox/components/still_image';
import VerificationBadge from 'soapbox/components/verification_badge';
import { getAcct } from 'soapbox/utils/accounts';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import { displayFqn } from 'soapbox/utils/state';

import { HStack, Stack, Text } from '../../../components/ui';
import { makeGetAccount } from '../../../selectors';

class UserPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.record,
    displayFqn: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    domain: PropTypes.string,
  }

  render() {
    const { account, action, badges, displayFqn, intl, domain } = this.props;
    if (!account) return null;
    const displayNameHtml = { __html: account.get('display_name_html') };
    const acct = account.get('acct').indexOf('@') === -1 && domain ? `${account.get('acct')}@${domain}` : account.get('acct');
    const header = account.get('header');
    const verified = account.get('verified');

    return (
      <div className='relative'>
        <Stack space={2}>
          <Stack>
            <div className='-mt-4 -mx-4 h-24 bg-gray-200 relative'>
              {header && (
                <StillImage
                  src={account.get('header')}
                  className='absolute inset-0 object-cover'
                  alt=''
                />
              )}
            </div>

            <HStack justifyContent='between'>
              <Link
                to={`/@${account.get('acct')}`}
                title={acct}
                className='-mt-12 block'
              >
                <Avatar
                  account={account}
                  className='h-20 w-20 bg-gray-50 ring-2 ring-white'
                />
              </Link>

              {action && (
                <div className='mt-2'>{action}</div>
              )}
            </HStack>
          </Stack>

          <Stack>
            <Link to={`/@${account.get('acct')}`}>
              <HStack space={1} alignItems='center'>
                <Text size='lg' weight='bold' dangerouslySetInnerHTML={displayNameHtml} />

                {verified && <VerificationBadge />}

                {badges.length > 0 && (
                  <HStack space={1} alignItems='center'>
                    {badges}
                  </HStack>
                )}
              </HStack>
            </Link>

            <Text size='sm' theme='muted'>
              @{getAcct(account, displayFqn)}
            </Text>
          </Stack>

          <HStack alignItems='center' space={3}>
            {account.get('statuses_count') >= 0 && (
              <Link to={`/@${account.get('acct')}`} title={intl.formatNumber(account.get('statuses_count'))}>
                <HStack alignItems='center' space={1}>
                  <Text theme='primary' weight='bold' size='sm'>
                    {shortNumberFormat(account.get('statuses_count'))}
                  </Text>
                  <Text weight='bold' size='sm'>
                    <FormattedMessage className='user-panel-stats-item__label' id='account.posts' defaultMessage='Posts' />
                  </Text>
                </HStack>
              </Link>
            )}

            {account.get('followers_count') >= 0 && (
              <Link to={`/@${account.get('acct')}/followers`} title={intl.formatNumber(account.get('followers_count'))}>
                <HStack alignItems='center' space={1}>
                  <Text theme='primary' weight='bold' size='sm'>
                    {shortNumberFormat(account.get('followers_count'))}
                  </Text>
                  <Text weight='bold' size='sm'>
                    <FormattedMessage id='account.followers' defaultMessage='Followers' />
                  </Text>
                </HStack>
              </Link>
            )}

            {account.get('following_count') >= 0 && (
              <Link to={`/@${account.get('acct')}/following`} title={intl.formatNumber(account.get('following_count'))}>
                <HStack alignItems='center' space={1}>
                  <Text theme='primary' weight='bold' size='sm'>
                    {shortNumberFormat(account.get('following_count'))}
                  </Text>
                  <Text weight='bold' size='sm'>
                    <FormattedMessage id='account.follows' defaultMessage='Follows' />
                  </Text>
                </HStack>
              </Link>
            )}
          </HStack>
        </Stack>
      </div>
    );
  }

}

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
    displayFqn: displayFqn(state),
  });

  return mapStateToProps;
};

export default injectIntl(
  connect(makeMapStateToProps, null, null, {
    forwardRef: true,
  })(UserPanel));

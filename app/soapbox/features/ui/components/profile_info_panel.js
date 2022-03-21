'use strict';

import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { initAccountNoteModal } from 'soapbox/actions/account_notes';
import Badge from 'soapbox/components/badge';
import { Icon, HStack, Stack, Text } from 'soapbox/components/ui';
import VerificationBadge from 'soapbox/components/verification_badge';
import { getAcct, isAdmin, isModerator, isLocal } from 'soapbox/utils/accounts';
import { displayFqn } from 'soapbox/utils/state';

import ProfileStats from './profile_stats';

// Basically ensure the URL isn't `javascript:alert('hi')` or something like that
const isSafeUrl = text => {
  try {
    const url = new URL(text);
    return ['http:', 'https:'].includes(url.protocol);
  } catch(e) {
    return false;
  }
};

const messages = defineMessages({
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  deactivated: { id: 'account.deactivated', defaultMessage: 'Deactivated' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
});

class ProfileInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    identity_proofs: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
    username: PropTypes.string,
    displayFqn: PropTypes.bool,
    onShowNote: PropTypes.func,
  };

  getStaffBadge = () => {
    const { account } = this.props;

    if (isAdmin(account)) {
      return <Badge slug='admin' title='Admin' key='staff' />;
    } else if (isModerator(account)) {
      return <Badge slug='moderator' title='Moderator' key='staff' />;
    } else {
      return null;
    }
  }

  getBadges = () => {
    const { account } = this.props;
    const staffBadge = this.getStaffBadge();
    const isPatron = account.getIn(['patron', 'is_patron']);

    const badges = [];

    if (staffBadge) {
      badges.push(staffBadge);
    }

    if (isPatron) {
      badges.push(<Badge slug='patron' title='Patron' key='patron' />);
    }

    return badges;
  }

  renderBirthday = () => {
    const { account, intl } = this.props;

    const birthday = account.get('birthday');
    if (!birthday) return null;

    const formattedBirthday = intl.formatDate(birthday, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });

    const date = new Date(birthday);
    const today = new Date();

    const hasBirthday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

    return (
      <HStack alignItems='center' space={0.5}>
        <Icon
          src={require('@tabler/icons/icons/ballon.svg')}
          className='w-4 h-4 text-gray-800'
        />

        <Text size='sm'>
          {hasBirthday ? (
            <FormattedMessage id='account.birthday_today' defaultMessage='Birthday is today!' />
          ) : (
            <FormattedMessage id='account.birthday' defaultMessage='Born {date}' values={{ date: formattedBirthday }} />
          )}
        </Text>
      </HStack>
    );
  }

  handleShowNote = e => {
    const { account, onShowNote } = this.props;

    e.preventDefault();
    onShowNote(account);
  }

  render() {
    const { account, displayFqn, intl, username } = this.props;

    if (!account) {
      return (
        <div className='mt-6 min-w-0 flex-1 sm:px-2'>
          <Stack space={2}>
            <Stack>
              <HStack space={1} alignItems='center'>
                <Text size='sm' theme='muted'>
                  @{username}
                </Text>
              </HStack>
            </Stack>
          </Stack>
        </div>
      );
    }

    const content = { __html: account.get('note_emojified') };
    const deactivated = !account.getIn(['pleroma', 'is_active'], true);
    const displayNameHtml = deactivated ? { __html: intl.formatMessage(messages.deactivated) } : { __html: account.get('display_name_html') };
    const memberSinceDate = intl.formatDate(account.get('created_at'), { month: 'long', year: 'numeric' });
    const verified = account.get('verified');
    const badges = this.getBadges();

    return (
      <div className='mt-6 min-w-0 flex-1 sm:px-2'>
        <Stack space={2}>
          {/* Not sure if this is actual used. */}
          {/* <div className='profile-info-panel-content__deactivated'>
            <FormattedMessage
              id='account.deactivated_description' defaultMessage='This account has been deactivated.'
            />
          </div> */}

          <Stack>
            <HStack space={1} alignItems='center'>
              <Text size='lg' weight='bold' dangerouslySetInnerHTML={displayNameHtml} />

              {verified && <VerificationBadge />}

              {account.get('bot') && <Badge slug='bot' title={intl.formatMessage(messages.bot)} />}

              {badges.length > 0 && (
                <HStack space={1} alignItems='center'>
                  {badges}
                </HStack>
              )}
            </HStack>

            <HStack alignItems='center' space={0.5}>
              <Text size='sm' theme='muted'>
                @{getAcct(account, displayFqn)}
              </Text>

              {account.get('locked') && (
                <Icon
                  src={require('@tabler/icons/icons/lock.svg')}
                  title={intl.formatMessage(messages.account_locked)}
                  className='w-4 h-4 text-gray-600'
                />
              )}
            </HStack>
          </Stack>

          <ProfileStats account={account} />

          {
            (account.get('note').length > 0 && account.get('note') !== '<p></p>') &&
            <Text size='sm' dangerouslySetInnerHTML={content} />
          }

          <div className='flex flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-2'>
            {isLocal(account) ? (
              <HStack alignItems='center' space={0.5}>
                <Icon
                  src={require('@tabler/icons/icons/calendar.svg')}
                  className='w-4 h-4 text-gray-800'
                />

                <Text size='sm'>
                  <FormattedMessage
                    id='account.member_since' defaultMessage='Joined {date}' values={{
                      date: memberSinceDate,
                    }}
                  />
                </Text>
              </HStack>
            ) : null}

            {account.get('location') ? (
              <HStack alignItems='center' space={0.5}>
                <Icon
                  src={require('@tabler/icons/icons/map-pin.svg')}
                  className='w-4 h-4 text-gray-800'
                />

                <Text size='sm'>
                  {account.get('location')}
                </Text>
              </HStack>
            ) : null}

            {account.get('website') ? (
              <HStack alignItems='center' space={0.5}>
                <Icon
                  src={require('@tabler/icons/icons/link.svg')}
                  className='w-4 h-4 text-gray-800'
                />

                <Text size='sm'>
                  {isSafeUrl(account.get('website')) ? (
                    <a className='text-primary-600 hover:underline' href={account.get('website')} target='_blank'>{account.get('website')}</a>
                  ) : (
                    account.get('website')
                  )}
                </Text>
              </HStack>
            ) : null}

            {this.renderBirthday()}
          </div>
        </Stack>
      </div>
    );
  }

}

const mapStateToProps = (state, { account }) => {
  const identity_proofs = account ? state.getIn(['identity_proofs', account.get('id')], ImmutableList()) : ImmutableList();
  return {
    identity_proofs,
    domain: state.getIn(['meta', 'domain']),
    displayFqn: displayFqn(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onShowNote(account) {
    dispatch(initAccountNoteModal(account));
  },
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
  },
  )(ProfileInfoPanel));

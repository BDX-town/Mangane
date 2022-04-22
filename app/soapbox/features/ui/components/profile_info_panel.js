'use strict';

import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { initAccountNoteModal } from 'soapbox/actions/account_notes';
import Badge from 'soapbox/components/badge';
import Icon from 'soapbox/components/icon';
import VerificationBadge from 'soapbox/components/verification_badge';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { CryptoAddress } from 'soapbox/features/ui/util/async-components';
import { getAcct, isAdmin, isModerator, isLocal } from 'soapbox/utils/accounts';
import { displayFqn } from 'soapbox/utils/state';

import ProfileStats from './profile_stats';

const TICKER_REGEX = /\$([a-zA-Z]*)/i;

const getTicker = value => (value.match(TICKER_REGEX) || [])[1];
const isTicker = value => Boolean(getTicker(value));

const messages = defineMessages({
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  deactivated: { id: 'account.deactivated', defaultMessage: 'Deactivated' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
});

const dateFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
};

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

  getBirthday = () => {
    const { account, intl } = this.props;

    const birthday = account.get('birthday');
    if (!birthday) return null;

    const formattedBirthday = intl.formatDate(birthday, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });

    const date = new Date(birthday);
    const today = new Date();

    const hasBirthday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

    if (hasBirthday) {
      return (
        <div className='profile-info-panel-content__birthday' title={formattedBirthday}>
          <Icon src={require('@tabler/icons/icons/ballon.svg')} />
          <FormattedMessage
            id='account.birthday_today' defaultMessage='Birthday is today!'
          />
        </div>
      );
    }
    return (
      <div className='profile-info-panel-content__birthday'>
        <Icon src={require('@tabler/icons/icons/ballon.svg')} />
        <FormattedMessage
          id='account.birthday' defaultMessage='Born {date}' values={{
            date: formattedBirthday,
          }}
        />
      </div>
    );
  }

  handleShowNote = e => {
    const { account, onShowNote } = this.props;

    e.preventDefault();
    onShowNote(account);
  }

  render() {
    const { account, displayFqn, intl, identity_proofs, username } = this.props;

    if (!account) {
      return (
        <div className='profile-info-panel'>
          <div className='profile-info-panel__content'>
            <div className='profile-info-panel-content__name'>
              <h1>
                <span />
                <small>@{username}</small>
              </h1>
            </div>
          </div>
        </div>
      );
    }

    const content = { __html: account.get('note_emojified') };
    const fields = account.get('fields');
    const deactivated = !account.getIn(['pleroma', 'is_active'], true);
    const displayNameHtml = deactivated ? { __html: intl.formatMessage(messages.deactivated) } : { __html: account.get('display_name_html') };
    const memberSinceDate = intl.formatDate(account.get('created_at'), { month: 'long', year: 'numeric' });
    const verified = account.get('verified');
    const badges = this.getBadges();

    return (
      <div className={classNames('profile-info-panel', { 'deactivated': deactivated })} >
        <div className='profile-info-panel__content'>

          <div className='profile-info-panel-content__name'>
            <h1>
              <span dangerouslySetInnerHTML={displayNameHtml} className='profile-info-panel__name-content' />
              {verified && <VerificationBadge />}
              {account.get('bot') && <Badge slug='bot' title={intl.formatMessage(messages.bot)} />}
              <small>
                @{getAcct(account, displayFqn)}
                {account.get('locked') && (
                  <Icon src={require('@tabler/icons/icons/lock.svg')} title={intl.formatMessage(messages.account_locked)} />
                )}
              </small>
            </h1>
          </div>

          {badges.length > 0 && (
            <div className='profile-info-panel-content__badges'>
              {badges}
            </div>
          )}

          <div className='profile-info-panel-content__deactivated'>
            <FormattedMessage
              id='account.deactivated_description' defaultMessage='This account has been deactivated.'
            />
          </div>

          {
            (account.get('note').length > 0 && account.get('note') !== '<p></p>') &&
            <div className='profile-info-panel-content__bio' dangerouslySetInnerHTML={content} />
          }

          {isLocal(account) && <div className='profile-info-panel-content__join-date'>
            <Icon src={require('@tabler/icons/icons/calendar.svg')} />
            <FormattedMessage
              id='account.member_since' defaultMessage='Joined {date}' values={{
                date: memberSinceDate,
              }}
            />
          </div>}

          {this.getBirthday()}

          {account.get('location') && (
            <div className='profile-info-panel-content__location'>
              <Icon src={require('@tabler/icons/icons/map-pin.svg')} />
              {account.get('location')}
            </div>
          )}

          {!!account.getIn(['relationship', 'note']) && (
            <a href='#' className='profile-info-panel-content__note' onClick={this.handleShowNote}>
              <Icon src={require('@tabler/icons/icons/note.svg')} />
              <FormattedMessage id='account.show_note' defaultMessage='Show note' />
            </a>
          )}

          <ProfileStats
            className='profile-info-panel-content__stats'
            account={account}
          />

          {(fields.size > 0 || identity_proofs.size > 0) && (
            <div className='profile-info-panel-content__fields'>
              {identity_proofs.map((proof, i) => (
                <dl className='test' key={i}>
                  <dt dangerouslySetInnerHTML={{ __html: proof.get('provider') }} />

                  <dd className='verified'>
                    <a href={proof.get('proof_url')} target='_blank' rel='noopener'>
                      <span title={intl.formatMessage(messages.linkVerifiedOn, { date: intl.formatDate(proof.get('updated_at'), dateFormatOptions) })}>
                        <Icon id='check' className='verified__mark' />
                      </span>
                    </a>
                    <a href={proof.get('profile_url')} target='_blank' rel='noopener'>
                      <span dangerouslySetInnerHTML={{ __html: ' ' + proof.get('provider_username') }} />
                    </a>
                  </dd>
                </dl>
              ))}

              {fields.map((pair, i) =>
                isTicker(pair.get('name', '')) ? (
                  <BundleContainer fetchComponent={CryptoAddress} key={i}>
                    {Component => (
                      <Component
                        key={i}
                        ticker={getTicker(pair.get('name')).toLowerCase()}
                        address={pair.get('value_plain')}
                      />
                    )}
                  </BundleContainer>
                ) : (
                  <dl className='profile-info-panel-content__fields__item' key={i}>
                    <dt dangerouslySetInnerHTML={{ __html: pair.get('name_emojified') }} title={pair.get('name')} />

                    <dd className={pair.get('verified_at') && 'verified'} title={pair.get('value_plain')}>
                      {pair.get('verified_at') && <span title={intl.formatMessage(messages.linkVerifiedOn, { date: intl.formatDate(pair.get('verified_at'), dateFormatOptions) })}><Icon id='check' className='verified__mark' /></span>} <span dangerouslySetInnerHTML={{ __html: pair.get('value_emojified') }} />
                    </dd>
                  </dl>
                ),
              )}
            </div>
          )}
        </div>
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

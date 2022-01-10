import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import Permalink from 'soapbox/components/permalink';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import ActionButton from 'soapbox/features/ui/components/action_button';
import { makeGetAccount } from 'soapbox/selectors';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { id }) => ({
    me: state.get('me'),
    account: getAccount(state, id),
    autoPlayGif: getSettings(state).get('autoPlayGif'),
  });

  return mapStateToProps;
};

export default @injectIntl
@connect(makeMapStateToProps)
class AccountCard extends ImmutablePureComponent {

  static propTypes = {
    me: SoapboxPropTypes.me,
    account: ImmutablePropTypes.map.isRequired,
    autoPlayGif: PropTypes.bool,
  };

  render() {
    const { account, autoPlayGif, me } = this.props;

    const followedBy = me !== account.get('id') && account.getIn(['relationship', 'followed_by']);

    return (
      <div className='directory__card'>
        {followedBy &&
          <div className='directory__card__info'>
            <span className='relationship-tag'>
              <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
            </span>
          </div>}
        <div className='directory__card__action-button'>
          <ActionButton account={account} small />
        </div>
        <div className='directory__card__img'>
          <img src={autoPlayGif ? account.get('header') : account.get('header_static')} alt='' className='parallax' />
        </div>

        <div className='directory__card__bar'>
          <Permalink className='directory__card__bar__name' href={account.get('url')} to={`/@${account.get('acct')}`}>
            <Avatar account={account} size={48} />
            <DisplayName account={account} />
          </Permalink>
        </div>

        <div className='directory__card__extra'>
          <div
            className={classNames('account__header__content', (account.get('note').length === 0 || account.get('note') === '<p></p>') && 'empty')}
            dangerouslySetInnerHTML={{ __html: account.get('note_emojified') }}
          />
        </div>

        <div className='directory__card__extra'>
          <div className='accounts-table__count'>{shortNumberFormat(account.get('statuses_count'))} <small><FormattedMessage id='account.posts' defaultMessage='Toots' /></small></div>
          <div className='accounts-table__count'>{shortNumberFormat(account.get('followers_count'))} <small><FormattedMessage id='account.followers' defaultMessage='Followers' /></small></div>
          <div className='accounts-table__count'>{account.get('last_status_at') === null ? <FormattedMessage id='account.never_active' defaultMessage='Never' /> : <RelativeTimestamp timestamp={account.get('last_status_at')} />} <small><FormattedMessage id='account.last_status' defaultMessage='Last active' /></small></div>
        </div>
      </div>
    );
  }

}
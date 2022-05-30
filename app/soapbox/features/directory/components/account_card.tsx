import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getSettings } from 'soapbox/actions/settings';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display-name';
import Permalink from 'soapbox/components/permalink';
import RelativeTimestamp from 'soapbox/components/relative_timestamp';
import { Text } from 'soapbox/components/ui';
import ActionButton from 'soapbox/features/ui/components/action-button';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';
import { shortNumberFormat } from 'soapbox/utils/numbers';

const getAccount = makeGetAccount();

interface IAccountCard {
  id: string,
}

const AccountCard: React.FC<IAccountCard> = ({ id }) => {
  const me = useAppSelector((state) => state.me);
  const account = useAppSelector((state) => getAccount(state, id));
  const autoPlayGif = useAppSelector((state) => getSettings(state).get('autoPlayGif'));

  if (!account) return null;

  const followedBy = me !== account.id && account.relationship.get('followed_by');

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
        <img src={autoPlayGif ? account.header : account.header_static} alt='' className='parallax' />
      </div>

      <div className='directory__card__bar'>
        <Permalink className='directory__card__bar__name' href={account.url} to={`/@${account.acct}`}>
          <Avatar account={account} size={48} />
          <DisplayName account={account} />
        </Permalink>
      </div>

      <div className='directory__card__extra'>
        <Text
          className={classNames('account__header__content', (account.note.length === 0 || account.note === '<p></p>') && 'empty')}
          dangerouslySetInnerHTML={{ __html: account.note_emojified }}
        />
      </div>

      <div className='directory__card__extra'>
        <div className='accounts-table__count'>
          <Text theme='primary' size='sm'>
            {shortNumberFormat(account.statuses_count)}
          </Text> <small><FormattedMessage id='account.posts' defaultMessage='Posts' /></small>
        </div>
        <div className='accounts-table__count'>
          <Text theme='primary' size='sm'>
            {shortNumberFormat(account.followers_count)}
          </Text> <small><FormattedMessage id='account.followers' defaultMessage='Followers' />
          </small>
        </div>
        <div className='accounts-table__count'>
          {account.last_status_at === null
            ? <Text theme='primary' size='sm'><FormattedMessage id='account.never_active' defaultMessage='Never' /></Text>
            : <RelativeTimestamp className='text-primary-600 dark:text-primary-400' timestamp={account.last_status_at} />} <small><FormattedMessage id='account.last_status' defaultMessage='Last active' /></small>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;

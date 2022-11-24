import classNames from 'classnames';
import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';


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

  const followedBy = me !== account.id && account.relationship?.followed_by;

  return (
    <div className='directory__card shadow dark:bg-slate-700'>
      {followedBy &&
        <div className='directory__card__info'>
          <span className='bg-white rounded p-1 mt-1 text-[8px] opacity-90 uppercase'>
            <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
          </span>
        </div>}
      <div className='directory__card__img'>
        <img src={autoPlayGif ? account.header : account.header_static} alt='' className='parallax' />
      </div>

      <div className='px-4 py-3'>
        <Permalink href={account.url} to={`/@${account.acct}`}>
          <div className='flex justify-between items-end'>
            <Avatar className="absolute border-solid border-4 border-white dark:border-slate-800" account={account} size={100} />
            <div className="text-right grow">
              <ActionButton account={account} small />
            </div>
          </div>
          <Text className='mt-3 leading-5' size="lg">
            <DisplayName account={account} />
          </Text>
        </Permalink>
      </div>

      <div className='h-24 overflow-hidden px-4 py-3'>
        <Text
          size="sm"
          className={classNames('italic account__header__content', (account.note.length === 0 || account.note === '<p></p>') && 'empty')}
          dangerouslySetInnerHTML={{ __html: account.note_emojified }}
        />
      </div>

      <div className='flex items-center justify-between px-4 py-3 mt-4'>
        <div>
          <Text theme='primary' size='xs'>
            <FormattedMessage id='account.posts' defaultMessage='Posts' />
          </Text> 
          <Text weight='bold' size="lg" className='leading-5'><FormattedNumber value={account.statuses_count} /></Text>
        </div>
        <div className='accounts-table__count text-right'>
          <Text theme='primary' size="xs"><FormattedMessage id='account.last_status' defaultMessage='Last active' /></Text>
          {account.last_status_at === null
            ? <Text weight='bold' size="lg" className='leading-5 text-primary-600'><FormattedMessage id='account.never_active' defaultMessage='Never' /></Text>
            : <RelativeTimestamp weight="bold" size="lg" className='leading-5 text-primary-600' timestamp={account.last_status_at} />}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;

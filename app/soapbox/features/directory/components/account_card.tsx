/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import React from 'react';
import { FormattedMessage, FormattedNumber, defineMessages } from 'react-intl';


import { getSettings } from 'soapbox/actions/settings';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display-name';
import Permalink from 'soapbox/components/permalink';
import { Text } from 'soapbox/components/ui';
import ActionButton from 'soapbox/features/ui/components/action-button';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const getAccount = makeGetAccount();

interface IAccountCard {
  id: string,
}

const messages = defineMessages({
  today: { id: 'account.today', defaultMessage: 'Today' },
  yesterday: { id: 'account.yesterday', defaultMessage: 'Yesterday' },
  days: { id: 'account.days', defaultMessage: 'Days' },
});


const AccountCard: React.FC<IAccountCard> = ({ id }) => {
  const me = useAppSelector((state) => state.me);
  const account = useAppSelector((state) => getAccount(state, id));
  const autoPlayGif = useAppSelector((state) => getSettings(state).get('autoPlayGif'));


  const followedBy = me !== account.id && account.relationship?.followed_by;

  const ago = React.useMemo(() => {
    if (!account) return 0;
    const date = new Date(account.last_status_at).valueOf();
    const today = new Date().valueOf();

    const diffInDays = Math.floor((today - date) / 1000 / 60 / 60 / 24);

    return diffInDays;
  }, [account]);

  if (!account) return null;

  return (
    <div className='directory__card shadow dark:bg-slate-700 flex flex-col'>
      {followedBy &&
        <div className='directory__card__info'>
          <span className='bg-white rounded p-1 mt-1 text-[8px] opacity-90 uppercase dark:text-white dark:bg-slate-800'>
            <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
          </span>
        </div>}
      <div className='directory__card__img absolute w-full'>
        <img src={autoPlayGif ? account.header : account.header_static} alt='' className='parallax' />
      </div>

      <div className='px-4 py-3 mt-[70px]'>
        <div className='flex justify-between items-end min-h-[30px]'>
          <Permalink href={account.url} to={`/@${account.acct}`}>
            <Avatar className='border-solid border-4 border-white dark:border-slate-700' account={account} size={100} />
          </Permalink>
          <div className='text-right'>
            <ActionButton account={account} small />
          </div>
        </div>
        <Text className='mt-3 leading-5' size='lg'>
          <DisplayName account={account} />
        </Text>
      </div>

      <div className='h-24 overflow-hidden px-4 py-3 grow'>
        <Text
          size='sm'
          className={classNames('italic account__header__content', (account.note.length === 0 || account.note === '<p></p>') && 'empty')}
          dangerouslySetInnerHTML={{ __html: account.note_emojified }}
        />
      </div>

      <div className='flex items-center justify-between px-4 py-3 mt-4'>
        <div>
          <Text theme='primary' size='xs'>
            <FormattedMessage id='account.posts' defaultMessage='Posts' />
          </Text>
          <Text weight='bold' size='lg' className='leading-5'><FormattedNumber value={account.statuses_count} /></Text>
        </div>
        <div className='accounts-table__count text-right'>
          <Text theme='primary' size='xs'><FormattedMessage id='account.last_status' defaultMessage='Last active' /></Text>
          {account.last_status_at === null
            ? <Text weight='bold' size='lg' className='leading-5'><FormattedMessage id='account.never_active' defaultMessage='Never' /></Text>
            : <Text weight='bold' size='lg' className='leading-5'>
              {
                (ago < 1) && <FormattedMessage {...messages.today} />
              }
              {
                (ago >= 1 && ago < 2) && <FormattedMessage {...messages.yesterday} />
              }
              {
                ago >= 2 && <>{ ago } <FormattedMessage {...messages.days} /></>
              }
            </Text>}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;

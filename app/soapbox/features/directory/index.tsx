import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { fetchDirectory, expandDirectory } from 'soapbox/actions/directory';
import LoadMore from 'soapbox/components/load_more';
import Toggle from 'soapbox/components/ui/toggle/toggle';
import Column from 'soapbox/features/ui/components/column';
import { useAppSelector } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';

import AccountCard from './components/account_card';

const messages = defineMessages({
  title: { id: 'column.directory', defaultMessage: 'Browse profiles' },
  recentlyActive: { id: 'directory.recently_active', defaultMessage: 'Recently active' },
  newArrivals: { id: 'directory.new_arrivals', defaultMessage: 'New arrivals' },
  local: { id: 'directory.local', defaultMessage: 'From {domain} only' },
  federated: { id: 'directory.federated', defaultMessage: 'From known fediverse' },
});

const Directory = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const accountIds = useAppSelector((state) => state.user_lists.directory.items);
  const title = useAppSelector((state) => state.instance.get('title'));
  const features = useAppSelector((state) => getFeatures(state.instance));

  const [order, setOrder] = useState(params.get('order') || 'active');
  const [local, setLocal] = useState(!!params.get('local'));

  useEffect(() => {
    dispatch(fetchDirectory({ order: order || 'active', local: local || false }));
  }, [order, local]);

  const handleChangeOrder: React.ChangeEventHandler<HTMLInputElement> = e => {
    if (e.target.checked) setOrder('new');
    else setOrder('active');
  };

  const handleChangeLocal: React.ChangeEventHandler<HTMLInputElement> = e => {
    if (e.target.checked) setLocal(true);
    else setLocal(false);
  };

  const handleLoadMore = () => {
    dispatch(expandDirectory({ order: order || 'active', local: local || false }));
  };

  return (
    <Column icon='address-book-o' label={intl.formatMessage(messages.title)}>
      <div className='directory__filter-form flex items-center gap-4 my-3'>
        <div className='directory__filter-form__column flex items-center gap-2' role='group'>
          <Toggle id='new-arrivals' checked={order === 'new'} onChange={handleChangeOrder} /> <label htmlFor='new-arrivals'>{ intl.formatMessage(messages.newArrivals) }</label>
        </div>

        {features.federating && (
          <div className='directory__filter-form__column flex items-center gap-2' role='group'>
            <Toggle id='local' checked={local} onChange={handleChangeLocal} /> <label htmlFor='new-arrivals'>{intl.formatMessage(messages.local, { domain: title })}</label>
          </div>
        )}
      </div>

      <div className={classNames('directory__list')}>
        {accountIds.map((accountId) => <AccountCard id={accountId} key={accountId} />)}
      </div>

      <div className='mt-4 pt-3'>
        <LoadMore onClick={handleLoadMore} />
      </div>
    </Column>
  );
};

export default Directory;

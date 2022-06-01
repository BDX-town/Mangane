import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { fetchDirectory, expandDirectory } from 'soapbox/actions/directory';
import LoadMore from 'soapbox/components/load_more';
import RadioButton from 'soapbox/components/radio_button';
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

  const accountIds = useAppSelector((state) => state.user_lists.getIn(['directory', 'items'], ImmutableList()));
  const isLoading = useAppSelector((state) => state.user_lists.getIn(['directory', 'isLoading'], true));
  const title = useAppSelector((state) => state.instance.get('title'));
  const features = useAppSelector((state) => getFeatures(state.instance));

  const [order, setOrder] = useState(params.get('order') || 'active');
  const [local, setLocal] = useState(!!params.get('local'));

  useEffect(() => {
    dispatch(fetchDirectory({ order: order || 'active', local: local || false }));
  }, [order, local]);

  const handleChangeOrder: React.ChangeEventHandler<HTMLInputElement> = e => {
    setOrder(e.target.value);
  };

  const handleChangeLocal: React.ChangeEventHandler<HTMLInputElement> = e => {
    setLocal(e.target.value === '1');
  };

  const handleLoadMore = () => {
    dispatch(expandDirectory({ order: order || 'active', local: local || false }));
  };

  return (
    <Column icon='address-book-o' label={intl.formatMessage(messages.title)}>
      <div className='directory__filter-form'>
        <div className='directory__filter-form__column' role='group'>
          <RadioButton name='order' value='active' label={intl.formatMessage(messages.recentlyActive)} checked={order === 'active'} onChange={handleChangeOrder} />
          <RadioButton name='order' value='new' label={intl.formatMessage(messages.newArrivals)} checked={order === 'new'} onChange={handleChangeOrder} />
        </div>

        {features.federating && (
          <div className='directory__filter-form__column' role='group'>
            <RadioButton name='local' value='1' label={intl.formatMessage(messages.local, { domain: title })} checked={local} onChange={handleChangeLocal} />
            <RadioButton name='local' value='0' label={intl.formatMessage(messages.federated)} checked={!local} onChange={handleChangeLocal} />
          </div>
        )}
      </div>

      <div className={classNames('directory__list', { loading: isLoading })}>
        {accountIds.map((accountId: string) => <AccountCard id={accountId} key={accountId} />)}
      </div>

      <LoadMore onClick={handleLoadMore} visible={!isLoading} />
    </Column>
  );
};

export default Directory;

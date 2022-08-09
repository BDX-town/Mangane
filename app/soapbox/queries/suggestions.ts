import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchRelationships } from 'soapbox/actions/accounts';
import { importFetchedAccounts } from 'soapbox/actions/importer';
import { getLinks } from 'soapbox/api';
import { useAppDispatch } from 'soapbox/hooks';
import API from 'soapbox/queries/client';

type Account = {
  acct: string
  avatar: string
  avatar_static: string
  bot: boolean
  created_at: string
  discoverable: boolean
  display_name: string
  followers_count: number
  following_count: number
  group: boolean
  header: string
  header_static: string
  id: string
  last_status_at: string
  location: string
  locked: boolean
  note: string
  statuses_count: number
  url: string
  username: string
  verified: boolean
  website: string
}

type Suggestion = {
  source: 'staff'
  account: Account
}

const getV2Suggestions = async(dispatch: any, pageParam: any): Promise<{ data: Suggestion[], link: string | null, hasMore: boolean }> => {
  return dispatch(async() => {
    const link = pageParam?.link || '/api/v2/suggestions';
    const response = await API.get<Suggestion[]>(link);
    const hasMore = !!response.headers.link;
    const nextLink = getLinks(response).refs.find(link => link.rel === 'next')?.uri;

    const accounts = response.data.map(({ account }) => account);
    const accountIds = accounts.map((account) => account.id);
    dispatch(importFetchedAccounts(accounts));
    dispatch(fetchRelationships(accountIds));

    return {
      data: response.data,
      link: nextLink,
      hasMore,
    };
  });
};

export default function useOnboardingSuggestions() {
  const dispatch = useAppDispatch();

  const result = useInfiniteQuery(['suggestions', 'v2'], ({ pageParam }) => getV2Suggestions(dispatch, pageParam), {
    keepPreviousData: true,
    getNextPageParam: (config) => {
      if (config.hasMore) {
        return { link: config.link };
      }

      return undefined;
    },
  });

  const data = result.data?.pages.reduce<Suggestion[]>(
    (prev: Suggestion[], curr) => [...prev, ...curr.data],
    [],
  );

  return {
    ...result,
    data,
  };
}

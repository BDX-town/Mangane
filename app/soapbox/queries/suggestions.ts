import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchRelationships } from 'soapbox/actions/accounts';
import { importFetchedAccounts } from 'soapbox/actions/importer';
import { getLinks } from 'soapbox/api';
import { useApi, useAppDispatch } from 'soapbox/hooks';

import type { APIEntity } from 'soapbox/types/entities';

type Suggestion = {
  source: string,
  account: APIEntity,
}

type SuggestionsPage = {
  data: Suggestion[],
  link?: string,
  hasMore: boolean,
}

/** Fetch and normalize the account suggestions used by onboarding. */
const useOnboardingSuggestions = () => {
  const api = useApi();
  const dispatch = useAppDispatch();

  const getV2Suggestions = async(pageParam?: { link?: string }): Promise<SuggestionsPage> => {
    const response = await api.get<Suggestion[]>(pageParam?.link || '/api/v2/suggestions');
    const nextLink = getLinks(response).refs.find(link => link.rel === 'next')?.uri;
    const accounts = response.data.map(({ account }) => account);

    dispatch(importFetchedAccounts(accounts));
    dispatch(fetchRelationships(accounts.map(({ id }) => id)));

    return {
      data: response.data,
      link: nextLink,
      hasMore: Boolean(nextLink),
    };
  };

  const result = useInfiniteQuery(['suggestions', 'v2'], ({ pageParam }) => getV2Suggestions(pageParam), {
    keepPreviousData: true,
    getNextPageParam: ({ hasMore, link }) => hasMore ? { link } : undefined,
  });

  return {
    ...result,
    data: result.data?.pages.flatMap(page => page.data),
  };
};

export default useOnboardingSuggestions;

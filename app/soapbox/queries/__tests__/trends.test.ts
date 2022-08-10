import { __stub } from 'soapbox/api';
import { queryClient, renderHook, waitFor } from 'soapbox/jest/test-helpers';

import useTrends from '../trends';

describe('useTrends', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  describe('with a successful query', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/trends')
          .reply(200, [
            { name: '#golf', url: 'https://example.com' },
            { name: '#tennis', url: 'https://example.com' },
          ]);
      });
    });

    it('is successful', async() => {
      const { result } = renderHook(() => useTrends());

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(result.current.data?.length).toBe(2);
    });
  });

  describe('with an unsuccessful query', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/trends').networkError();
      });
    });

    it('is successful', async() => {
      const { result } = renderHook(() => useTrends());

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(result.current.error).toBeDefined();
    });
  });
});

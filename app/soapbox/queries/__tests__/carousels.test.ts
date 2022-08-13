import { __stub } from 'soapbox/api';
import { renderHook, waitFor } from 'soapbox/jest/test-helpers';

import useCarouselAvatars from '../carousels';

describe('useCarouselAvatars', () => {
  describe('with a successful query', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/truth/carousels/avatars')
          .reply(200, [
            { account_id: '1', acct: 'a', account_avatar: 'https://example.com/some.jpg' },
            { account_id: '2', acct: 'b', account_avatar: 'https://example.com/some.jpg' },
            { account_id: '3', acct: 'c', account_avatar: 'https://example.com/some.jpg' },
            { account_id: '4', acct: 'd', account_avatar: 'https://example.com/some.jpg' },
          ]);
      });
    });

    it('is successful', async() => {
      const { result } = renderHook(() => useCarouselAvatars());

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(result.current.data?.length).toBe(4);
    });
  });

  describe('with an unsuccessful query', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/truth/carousels/avatars').networkError();
      });
    });

    it('is successful', async() => {
      const { result } = renderHook(() => useCarouselAvatars());

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(result.current.error).toBeDefined();
    });
  });
});

import { fromJS } from 'immutable';

import api from '../api';
import { advanceSessionGeneration } from '../persistence/lifecycle';

describe('stateful API session generation fence', () => {
  it('rejects a response that resolves after an account transition', async() => {
    const state = {
      accounts: fromJS({
        alice: { url: 'https://social.example/users/alice' },
      }),
      auth: fromJS({
        app: {},
        me: 'https://social.example/users/alice',
        users: {
          'https://social.example/users/alice': {
            access_token: 'secret-token',
          },
        },
      }),
      me: 'alice',
    } as any;
    const client = api(() => state);
    client.defaults.adapter = async config => {
      advanceSessionGeneration();
      return {
        config,
        data: { private: true },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    await expect(client.get('/private')).rejects.toMatchObject({
      code: 'STALE_SESSION_GENERATION',
      name: 'StaleSessionGenerationError',
    });
  });
});

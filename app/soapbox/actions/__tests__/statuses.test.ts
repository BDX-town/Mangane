import { fromJS, Map as ImmutableMap } from 'immutable';

import { STATUSES_IMPORT } from 'soapbox/actions/importer';
import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';
import { normalizeStatus } from 'soapbox/normalizers/status';

import { deleteStatus, fetchContext, fetchStatusWithContext } from '../statuses';

describe('fetchContext()', () => {
  it('handles Mitra context', done => {
    const statuses = require('soapbox/__fixtures__/mitra-context.json');

    __stub(mock => {
      mock.onGet('/api/v1/statuses/017ed505-5926-392f-256a-f86d5075df70/context')
        .reply(200, statuses);
    });

    const store = mockStore(rootState);

    store.dispatch(fetchContext('017ed505-5926-392f-256a-f86d5075df70')).then(() => {
      const actions = store.getActions();

      expect(actions[3].type).toEqual(STATUSES_IMPORT);
      expect(actions[3].statuses[0].id).toEqual('017ed503-bc96-301a-e871-2c23b30ddd05');

      done();
    }).catch(console.error);
  });
});

const apiStatus = (id: string, inReplyToId: string | null = null) => ({
  id,
  uri: `https://remote.example/users/alice/statuses/${id}`,
  url: `https://remote.example/@alice/${id}`,
  created_at: '2026-07-29T00:00:00.000Z',
  in_reply_to_id: inReplyToId,
  in_reply_to_account_id: inReplyToId ? 'alice' : null,
  sensitive: false,
  spoiler_text: '',
  visibility: 'public',
  language: 'en',
  replies_count: 0,
  reblogs_count: 0,
  favourites_count: 0,
  edited_at: null,
  content: `<p>${id}</p>`,
  reblog: null,
  application: null,
  account: {
    id: 'alice',
    username: 'alice',
    acct: 'alice@remote.example',
    display_name: 'Alice',
    locked: false,
    bot: false,
    discoverable: true,
    group: false,
    created_at: '2020-01-01T00:00:00.000Z',
    note: '',
    url: 'https://remote.example/@alice',
    avatar: 'https://remote.example/avatar.png',
    avatar_static: 'https://remote.example/avatar.png',
    header: 'https://remote.example/header.png',
    header_static: 'https://remote.example/header.png',
    followers_count: 1,
    following_count: 1,
    statuses_count: 2,
    last_status_at: '2026-07-29',
    emojis: [],
    fields: [],
  },
  media_attachments: [],
  mentions: [],
  tags: [],
  emojis: [],
  card: null,
  poll: null,
});

describe('fetchStatusWithContext()', () => {
  it('repairs a parent omitted by the context endpoint', async() => {
    const reply = apiStatus('reply', 'parent');
    const parent = apiStatus('parent');

    __stub(mock => {
      mock.onGet('/api/v1/statuses/reply').reply(200, reply);
      mock.onGet('/api/v1/statuses/reply/context').reply(200, { ancestors: [], descendants: [] });
      mock.onGet('/api/v1/statuses/parent').reply(200, parent);
    });

    const store = mockStore(rootState.setIn(['statuses', reply.id], normalizeStatus(reply)));
    await store.dispatch(fetchStatusWithContext('reply'));

    const repairedContext = store.getActions()
      .filter(action => action.type === 'CONTEXT_FETCH_SUCCESS')
      .pop();

    expect(repairedContext.ancestors.map((item: { id: string }) => item.id)).toEqual(['parent']);
    expect(repairedContext.descendants).toEqual([]);
  });

  it('repairs the parent even when the context request fails', async() => {
    const reply = apiStatus('reply', 'parent');
    const parent = apiStatus('parent');

    __stub(mock => {
      mock.onGet('/api/v1/statuses/reply').reply(200, reply);
      mock.onGet('/api/v1/statuses/reply/context').networkError();
      mock.onGet('/api/v1/statuses/parent').reply(200, parent);
    });

    const store = mockStore(rootState.setIn(['statuses', reply.id], normalizeStatus(reply)));
    await store.dispatch(fetchStatusWithContext('reply'));

    const repairedContext = store.getActions()
      .filter(action => action.type === 'CONTEXT_FETCH_SUCCESS')
      .pop();

    expect(repairedContext.ancestors.map((item: { id: string }) => item.id)).toEqual(['parent']);
  });
});

describe('deleteStatus()', () => {
  let store: ReturnType<typeof mockStore>;

  describe('if logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(deleteStatus('1'));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('if logged in', () => {
    const statusId = 'AHU2RrX0wdcwzCYjFQ';
    const cachedStatus = normalizeStatus({
      id: statusId,
    });

    beforeEach(() => {
      const state = rootState
        .set('me', '1234')
        .set('statuses', fromJS({
          [statusId]: cachedStatus,
        }) as any);
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      let status: any;

      beforeEach(() => {
        status = require('soapbox/__fixtures__/pleroma-status-deleted.json');

        __stub((mock) => {
          mock.onDelete(`/api/v1/statuses/${statusId}`).reply(200, status);
        });
      });

      it('should delete the status from the API', async() => {
        const expectedActions = [
          {
            type: 'STATUS_DELETE_REQUEST',
            params: cachedStatus,
          },
          { type: 'STATUS_DELETE_SUCCESS', id: statusId },
          {
            type: 'TIMELINE_DELETE',
            id: statusId,
            accountId: null,
            references: ImmutableMap({}),
            reblogOf: null,
          },
        ];
        await store.dispatch(deleteStatus(statusId));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });

      it('should handle redraft', async() => {
        const expectedActions = [
          {
            type: 'STATUS_DELETE_REQUEST',
            params: cachedStatus,
          },
          { type: 'STATUS_DELETE_SUCCESS', id: statusId },
          {
            type: 'TIMELINE_DELETE',
            id: statusId,
            accountId: null,
            references: ImmutableMap({}),
            reblogOf: null,
          },
          {
            type: 'COMPOSE_SET_STATUS',
            status: cachedStatus,
            rawText: status.text,
            explicitAddressing: false,
            spoilerText: '',
            contentType: 'text/markdown',
            v: {
              build: undefined,
              compatVersion: '0.0.0',
              software: 'Mastodon',
              version: '0.0.0',
            },
            withRedraft: true,
          },
          { type: 'MODAL_OPEN', modalType: 'COMPOSE', modalProps: undefined },
        ];
        await store.dispatch(deleteStatus(statusId, true));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onDelete(`/api/v1/statuses/${statusId}`).networkError();
        });
      });

      it('should dispatch failed action', async() => {
        const expectedActions = [
          {
            type: 'STATUS_DELETE_REQUEST',
            params: cachedStatus,
          },
          {
            type: 'STATUS_DELETE_FAIL',
            params: cachedStatus,
            error: new Error('Network Error'),
          },
        ];
        await store.dispatch(deleteStatus(statusId, true));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});
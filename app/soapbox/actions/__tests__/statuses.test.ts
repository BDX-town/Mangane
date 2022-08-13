import { fromJS, Map as ImmutableMap } from 'immutable';

import { STATUSES_IMPORT } from 'soapbox/actions/importer';
import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';
import { normalizeStatus } from 'soapbox/normalizers/status';

import { deleteStatus, fetchContext } from '../statuses';

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

import { List as ImmutableList } from 'immutable';

import { fetchAnnouncements, dismissAnnouncement, addReaction, removeReaction } from 'soapbox/actions/announcements';
import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';
import { normalizeAnnouncement, normalizeInstance } from 'soapbox/normalizers';

import type { APIEntity } from 'soapbox/types/entities';

const announcements = require('soapbox/__fixtures__/announcements.json');

describe('fetchAnnouncements()', () => {
  describe('with a successful API request', () => {
    it('should fetch announcements from the API', async() => {
      const state = rootState
        .set('instance', normalizeInstance({ version: '3.5.3' }));
      const store = mockStore(state);

      __stub((mock) => {
        mock.onGet('/api/v1/announcements').reply(200, announcements);
      });

      const expectedActions = [
        { type: 'ANNOUNCEMENTS_FETCH_REQUEST', skipLoading: true },
        { type: 'ANNOUNCEMENTS_FETCH_SUCCESS', announcements, skipLoading: true },
        { type: 'POLLS_IMPORT', polls: [] },
        { type: 'ACCOUNTS_IMPORT', accounts: [] },
        { type: 'STATUSES_IMPORT', statuses: [], expandSpoilers: false },
      ];
      await store.dispatch(fetchAnnouncements());
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('dismissAnnouncement', () => {
  describe('with a successful API request', () => {
    it('should mark announcement as dismissed', async() => {
      const store = mockStore(rootState);

      __stub((mock) => {
        mock.onPost('/api/v1/announcements/1/dismiss').reply(200);
      });

      const expectedActions = [
        { type: 'ANNOUNCEMENTS_DISMISS_REQUEST', id: '1' },
        { type: 'ANNOUNCEMENTS_DISMISS_SUCCESS', id: '1' },
      ];
      await store.dispatch(dismissAnnouncement('1'));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('addReaction', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    const state = rootState
      .setIn(['announcements', 'items'], ImmutableList((announcements).map((announcement: APIEntity) => normalizeAnnouncement(announcement))))
      .setIn(['announcements', 'isLoading'], false);
    store = mockStore(state);
  });

  describe('with a successful API request', () => {
    it('should add reaction to a post', async() => {
      __stub((mock) => {
        mock.onPut('/api/v1/announcements/2/reactions/📉').reply(200);
      });

      const expectedActions = [
        { type: 'ANNOUNCEMENTS_REACTION_ADD_REQUEST', id: '2', name: '📉', skipLoading: true },
        { type: 'ANNOUNCEMENTS_REACTION_ADD_SUCCESS', id: '2', name: '📉', skipLoading: true },
      ];
      await store.dispatch(addReaction('2', '📉'));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('removeReaction', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    const state = rootState
      .setIn(['announcements', 'items'], ImmutableList((announcements).map((announcement: APIEntity) => normalizeAnnouncement(announcement))))
      .setIn(['announcements', 'isLoading'], false);
    store = mockStore(state);
  });

  describe('with a successful API request', () => {
    it('should remove reaction from a post', async() => {
      __stub((mock) => {
        mock.onDelete('/api/v1/announcements/2/reactions/📉').reply(200);
      });

      const expectedActions = [
        { type: 'ANNOUNCEMENTS_REACTION_REMOVE_REQUEST', id: '2', name: '📉', skipLoading: true },
        { type: 'ANNOUNCEMENTS_REACTION_REMOVE_SUCCESS', id: '2', name: '📉', skipLoading: true },
      ];
      await store.dispatch(removeReaction('2', '📉'));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

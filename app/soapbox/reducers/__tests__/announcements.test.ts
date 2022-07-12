import { List as ImmutableList, Record as ImmutableRecord, Set as ImmutableSet } from 'immutable';

import {
  ANNOUNCEMENTS_FETCH_SUCCESS,
  ANNOUNCEMENTS_UPDATE,
} from 'soapbox/actions/announcements';

import reducer from '../announcements';

const announcements = require('soapbox/__fixtures__/announcements.json');

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toMatchObject({
      items: ImmutableList(),
      isLoading: false,
      show: false,
      unread: ImmutableSet(),
    });
  });

  describe('ANNOUNCEMENTS_FETCH_SUCCESS', () => {
    it('parses announcements as Records', () => {
      const action = { type: ANNOUNCEMENTS_FETCH_SUCCESS, announcements };
      const result = reducer(undefined, action).items;

      expect(result.every((announcement) => ImmutableRecord.isRecord(announcement))).toBe(true);
    });
  });

  describe('ANNOUNCEMENTS_UPDATE', () => {
    it('updates announcements', () => {
      const state = reducer(undefined, { type: ANNOUNCEMENTS_FETCH_SUCCESS, announcements: [announcements[0]] });

      const action = { type: ANNOUNCEMENTS_UPDATE, announcement: { ...announcements[0], content: '<p>Updated to Soapbox v3.0.0.</p>' } };
      const result = reducer(state, action).items;

      expect(result.size === 1);
      expect(result.first()?.content === '<p>Updated to Soapbox v3.0.0.</p>');
    });
  });
});

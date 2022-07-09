import {
  Map as ImmutableMap,
  OrderedSet as ImmutableOrderedSet,
  fromJS,
  is,
} from 'immutable';

import { STATUS_IMPORT } from 'soapbox/actions/importer';
import { CONTEXT_FETCH_SUCCESS } from 'soapbox/actions/statuses';
import { TIMELINE_DELETE } from 'soapbox/actions/timelines';
import { applyActions } from 'soapbox/jest/test-helpers';

import reducer, { ReducerRecord } from '../contexts';

describe('contexts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(ReducerRecord({
      inReplyTos: ImmutableMap(),
      replies: ImmutableMap(),
    }));
  });

  describe(CONTEXT_FETCH_SUCCESS, () => {
    it('inserts a tombstone connecting an orphaned descendant', () => {
      const status = { id: 'A', in_reply_to_id: null };

      const context = {
        id: 'A',
        ancestors: [],
        descendants: [
          { id: 'C', in_reply_to_id: 'B' },
        ],
      };

      const actions = [
        { type: STATUS_IMPORT, status },
        { type: CONTEXT_FETCH_SUCCESS, ...context },
      ];

      const result = applyActions(undefined, actions, reducer);
      expect(result.inReplyTos.get('C')).toBe('C-tombstone');
      expect(result.replies.get('A').toArray()).toEqual(['C-tombstone']);
    });

    it('inserts a tombstone connecting an orphaned descendant (with null in_reply_to_id)', () => {
      const status = { id: 'A', in_reply_to_id: null };

      const context = {
        id: 'A',
        ancestors: [],
        descendants: [
          { id: 'C', in_reply_to_id: null },
        ],
      };

      const actions = [
        { type: STATUS_IMPORT, status },
        { type: CONTEXT_FETCH_SUCCESS, ...context },
      ];

      const result = applyActions(undefined, actions, reducer);
      expect(result.inReplyTos.get('C')).toBe('C-tombstone');
      expect(result.replies.get('A').toArray()).toEqual(['C-tombstone']);
    });

    it('doesn\'t explode when it encounters a loop', () => {
      const status = { id: 'A', in_reply_to_id: null };

      const context = {
        id: 'A',
        ancestors: [],
        descendants: [
          { id: 'C', in_reply_to_id: 'E' },
          { id: 'D', in_reply_to_id: 'C' },
          { id: 'E', in_reply_to_id: 'D' },
          { id: 'F', in_reply_to_id: 'F' },
        ],
      };

      const actions = [
        { type: STATUS_IMPORT, status },
        { type: CONTEXT_FETCH_SUCCESS, ...context },
      ];

      const result = applyActions(undefined, actions, reducer);

      // These checks are superficial. We just don't want a stack overflow!
      expect(result.inReplyTos.get('C')).toBe('C-tombstone');
      expect(result.replies.get('A').toArray()).toEqual(['C-tombstone', 'F-tombstone']);
    });
  });

  describe(TIMELINE_DELETE, () => {
    it('deletes the status', () => {
      const action = { type: TIMELINE_DELETE, id: 'B' };

      const state = ReducerRecord({
        inReplyTos: fromJS({
          B: 'A',
          C: 'B',
        }) as ImmutableMap<string, string>,
        replies: fromJS({
          A: ImmutableOrderedSet(['B']),
          B: ImmutableOrderedSet(['C']),
        }) as ImmutableMap<string, ImmutableOrderedSet<string>>,
      });

      const expected = ReducerRecord({
        inReplyTos: fromJS({}) as ImmutableMap<string, string>,
        replies: fromJS({
          A: ImmutableOrderedSet(),
        }) as ImmutableMap<string, ImmutableOrderedSet<string>>,
      });

      expect(is(reducer(state, action), expected)).toBe(true);
    });
  });
});

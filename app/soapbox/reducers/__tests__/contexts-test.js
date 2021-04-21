import reducer from '../contexts';
import { CONTEXT_FETCH_SUCCESS } from 'soapbox/actions/statuses';
import { TIMELINE_DELETE } from 'soapbox/actions/timelines';
import {
  Map as ImmutableMap,
  OrderedSet as ImmutableOrderedSet,
  fromJS,
} from 'immutable';
import context1 from 'soapbox/__fixtures__/context_1.json';
import context2 from 'soapbox/__fixtures__/context_2.json';

describe('contexts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      inReplyTos: ImmutableMap(),
      replies: ImmutableMap(),
    }));
  });

  it('should support rendering a complete tree', () => {
    // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/422
    let result;
    result = reducer(result, { type: CONTEXT_FETCH_SUCCESS, id: '9zIH8WYwtnUx4yDzUm', ancestors: context1.ancestors, descendants: context1.descendants });
    result = reducer(result, { type: CONTEXT_FETCH_SUCCESS, id: '9zIH7PUdhK3Ircg4hM', ancestors: context2.ancestors, descendants: context2.descendants });

    expect(result).toEqual(ImmutableMap({
      inReplyTos: ImmutableMap({
        '9zIH7PUdhK3Ircg4hM': '9zIH6kDXA10YqhMKqO',
        '9zIH7mMGgc1RmJwDLM': '9zIH6kDXA10YqhMKqO',
        '9zIH9GTCDWEFSRt2um': '9zIH7PUdhK3Ircg4hM',
        '9zIH9fhaP9atiJoOJc': '9zIH8WYwtnUx4yDzUm',
        '9zIH8WYwtnUx4yDzUm': '9zIH7PUdhK3Ircg4hM',
        '9zIH8WYwtnUx4yDzUm-tombstone': '9zIH7mMGgc1RmJwDLM',
      }),
      replies: ImmutableMap({
        '9zIH6kDXA10YqhMKqO': ImmutableOrderedSet([
          '9zIH7PUdhK3Ircg4hM',
          '9zIH7mMGgc1RmJwDLM',
        ]),
        '9zIH7PUdhK3Ircg4hM': ImmutableOrderedSet([
          '9zIH8WYwtnUx4yDzUm',
          '9zIH9GTCDWEFSRt2um',
        ]),
        '9zIH8WYwtnUx4yDzUm': ImmutableOrderedSet([
          '9zIH9fhaP9atiJoOJc',
        ]),
        '9zIH8WYwtnUx4yDzUm-tombstone': ImmutableOrderedSet([
          '9zIH8WYwtnUx4yDzUm',
        ]),
        '9zIH7mMGgc1RmJwDLM': ImmutableOrderedSet([
          '9zIH8WYwtnUx4yDzUm-tombstone',
        ]),
      }),
    }));
  });

  describe(TIMELINE_DELETE, () => {
    it('deletes the status', () => {
      const action = { type: TIMELINE_DELETE, id: 'B' };

      const state = fromJS({
        inReplyTos: {
          B: 'A',
          C: 'B',
        },
        replies: {
          A: ImmutableOrderedSet(['B']),
          B: ImmutableOrderedSet(['C']),
        },
      });

      const expected = fromJS({
        inReplyTos: {},
        replies: {
          A: ImmutableOrderedSet(),
        },
      });

      expect(reducer(state, action)).toEqual(expected);
    });
  });
});

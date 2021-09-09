import reducer from '../timelines';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet, fromJS } from 'immutable';
import {
  TIMELINE_EXPAND_REQUEST,
  TIMELINE_EXPAND_FAIL,
  TIMELINE_EXPAND_SUCCESS,
} from 'soapbox/actions/timelines';

describe('timelines reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  describe('TIMELINE_EXPAND_REQUEST', () => {
    it('sets loading to true', () => {
      const action = {
        type: TIMELINE_EXPAND_REQUEST,
        timeline: 'home',
      };

      const result = reducer(undefined, action);
      expect(result.getIn(['home', 'isLoading'])).toBe(true);
    });
  });

  describe('TIMELINE_EXPAND_FAIL', () => {
    it('sets loading to false', () => {
      const state = fromJS({
        home: { isLoading: true },
      });

      const action = {
        type: TIMELINE_EXPAND_FAIL,
        timeline: 'home',
      };

      const result = reducer(state, action);
      expect(result.getIn(['home', 'isLoading'])).toBe(false);
    });
  });

  describe('TIMELINE_EXPAND_SUCCESS', () => {
    it('sets loading to false', () => {
      const state = fromJS({
        home: { isLoading: true },
      });

      const action = {
        type: TIMELINE_EXPAND_SUCCESS,
        timeline: 'home',
      };

      const result = reducer(state, action);
      expect(result.getIn(['home', 'isLoading'])).toBe(false);
    });

    it('adds the status IDs', () => {
      const expected = ImmutableOrderedSet(['1', '2', '5']);

      const action = {
        type: TIMELINE_EXPAND_SUCCESS,
        timeline: 'home',
        statuses: [{ id: '1' }, { id: '2' }, { id: '5' }],
      };

      const result = reducer(undefined, action);
      expect(result.getIn(['home', 'items'])).toEqual(expected);
    });

    it('merges new status IDs', () => {
      const state = fromJS({
        home: { items: ImmutableOrderedSet(['5', '2', '1']) },
      });

      const expected = ImmutableOrderedSet(['6', '5', '4', '2', '1']);

      const action = {
        type: TIMELINE_EXPAND_SUCCESS,
        timeline: 'home',
        statuses: [{ id: '6' }, { id: '5' }, { id: '4' }],
      };

      const result = reducer(state, action);
      expect(result.getIn(['home', 'items'])).toEqual(expected);
    });

    it('merges old status IDs', () => {
      const state = fromJS({
        home: { items: ImmutableOrderedSet(['6', '4', '3']) },
      });

      const expected = ImmutableOrderedSet(['6', '4', '3', '5', '2', '1']);

      const action = {
        type: TIMELINE_EXPAND_SUCCESS,
        timeline: 'home',
        statuses: [{ id: '5' }, { id: '2' }, { id: '1' }],
      };

      const result = reducer(state, action);
      expect(result.getIn(['home', 'items'])).toEqual(expected);
    });

    it('overrides pinned post IDs', () => {
      const state = fromJS({
        'account:1:pinned': { items: ImmutableOrderedSet(['5', '2', '1']) },
      });

      const expected = ImmutableOrderedSet(['9', '8', '7']);

      const action = {
        type: TIMELINE_EXPAND_SUCCESS,
        timeline: 'home',
        statuses: [{ id: '9' }, { id: '8' }, { id: '7' }],
      };

      const result = reducer(state, action);
      expect(result.getIn(['home', 'items'])).toEqual(expected);
    });
  });
});

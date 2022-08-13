import {
  STATUS_HOVER_CARD_OPEN,
  STATUS_HOVER_CARD_CLOSE,
  STATUS_HOVER_CARD_UPDATE,
} from 'soapbox/actions/status-hover-card';

import reducer, { ReducerRecord } from '../status-hover-card';

describe(STATUS_HOVER_CARD_OPEN, () => {
  it('sets the ref and statusId', () => {
    const ref = { current: document.createElement('div') };

    const action = {
      type: STATUS_HOVER_CARD_OPEN,
      ref,
      statusId: '1234',
    };

    const result = reducer(undefined, action);
    expect(result.ref).toBe(ref);
    expect(result.statusId).toBe('1234');
  });
});

describe(STATUS_HOVER_CARD_CLOSE, () => {
  it('flushes the state', () => {
    const state = ReducerRecord({
      ref: { current: document.createElement('div') },
      statusId: '1234',
    });

    const action = { type: STATUS_HOVER_CARD_CLOSE };

    const result = reducer(state, action);
    expect(result.ref).toBe(null);
    expect(result.statusId).toBe('');
  });

  it('leaves the state alone if hovered', () => {
    const state = ReducerRecord({
      ref: { current: document.createElement('div') },
      statusId: '1234',
      hovered: true,
    });

    const action = { type: STATUS_HOVER_CARD_CLOSE };
    const result = reducer(state, action);
    expect(result).toEqual(state);
  });

  it('action.force flushes the state even if hovered', () => {
    const state = ReducerRecord({
      ref: { current: document.createElement('div') },
      statusId: '1234',
      hovered: true,
    });

    const action = { type: STATUS_HOVER_CARD_CLOSE, force: true };
    const result = reducer(state, action);
    expect(result.ref).toBe(null);
    expect(result.statusId).toBe('');
  });
});

describe(STATUS_HOVER_CARD_UPDATE, () => {
  it('sets hovered', () => {
    const state = ReducerRecord();
    const action = { type: STATUS_HOVER_CARD_UPDATE };
    const result = reducer(state, action);
    expect(result.hovered).toBe(true);
  });
});

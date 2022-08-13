import { fromJS } from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';

import { shouldFilter } from '../timelines';

import type { ReducerStatus } from 'soapbox/reducers/statuses';

describe('shouldFilter', () => {
  it('returns false under normal circumstances', () => {
    const columnSettings = fromJS({});
    const status = normalizeStatus({}) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('reblog: returns true when `shows.reblog == false`', () => {
    const columnSettings = fromJS({ shows: { reblog: false } });
    const status = normalizeStatus({ reblog: {} }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('reblog: returns false when `shows.reblog == true`', () => {
    const columnSettings = fromJS({ shows: { reblog: true } });
    const status = normalizeStatus({ reblog: {} }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('reply: returns true when `shows.reply == false`', () => {
    const columnSettings = fromJS({ shows: { reply: false } });
    const status = normalizeStatus({ in_reply_to_id: '1234' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('reply: returns false when `shows.reply == true`', () => {
    const columnSettings = fromJS({ shows: { reply: true } });
    const status = normalizeStatus({ in_reply_to_id: '1234' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('direct: returns true when `shows.direct == false`', () => {
    const columnSettings = fromJS({ shows: { direct: false } });
    const status = normalizeStatus({ visibility: 'direct' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('direct: returns false when `shows.direct == true`', () => {
    const columnSettings = fromJS({ shows: { direct: true } });
    const status = normalizeStatus({ visibility: 'direct' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('direct: returns false for a public post when `shows.direct == false`', () => {
    const columnSettings = fromJS({ shows: { direct: false } });
    const status = normalizeStatus({ visibility: 'public' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('multiple settings', () => {
    const columnSettings = fromJS({ shows: { reblog: false, reply: false, direct: false } });
    const status = normalizeStatus({ reblog: null, in_reply_to_id: null, visibility: 'direct' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('multiple settings', () => {
    const columnSettings = fromJS({ shows: { reblog: false, reply: true, direct: false } });
    const status = normalizeStatus({ reblog: null, in_reply_to_id: '1234', visibility: 'public' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('multiple settings', () => {
    const columnSettings = fromJS({ shows: { reblog: true, reply: false, direct: true } });
    const status = normalizeStatus({ reblog: {}, in_reply_to_id: '1234', visibility: 'direct' }) as ReducerStatus;
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });
});

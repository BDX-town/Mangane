import { fromJS } from 'immutable';

import { shouldFilter } from '../timelines';

describe('shouldFilter', () => {
  it('returns false under normal circumstances', () => {
    const columnSettings = fromJS({});
    const status = fromJS({});
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('reblog: returns true when `shows.reblog == false`', () => {
    const columnSettings = fromJS({ shows: { reblog: false } });
    const status = fromJS({ reblog: {} });
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('reblog: returns false when `shows.reblog == true`', () => {
    const columnSettings = fromJS({ shows: { reblog: true } });
    const status = fromJS({ reblog: {} });
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('reply: returns true when `shows.reply == false`', () => {
    const columnSettings = fromJS({ shows: { reply: false } });
    const status = fromJS({ in_reply_to_id: '1234' });
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('reply: returns false when `shows.reply == true`', () => {
    const columnSettings = fromJS({ shows: { reply: true } });
    const status = fromJS({ in_reply_to_id: '1234' });
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('direct: returns true when `shows.direct == false`', () => {
    const columnSettings = fromJS({ shows: { direct: false } });
    const status = fromJS({ visibility: 'direct' });
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('direct: returns false when `shows.direct == true`', () => {
    const columnSettings = fromJS({ shows: { direct: true } });
    const status = fromJS({ visibility: 'direct' });
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('direct: returns false for a public post when `shows.direct == false`', () => {
    const columnSettings = fromJS({ shows: { direct: false } });
    const status = fromJS({ visibility: 'public' });
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('multiple settings', () => {
    const columnSettings = fromJS({ shows: { reblog: false, reply: false, direct: false } });
    const status = fromJS({ reblog: null, in_reply_to_id: null, visibility: 'direct' });
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });

  it('multiple settings', () => {
    const columnSettings = fromJS({ shows: { reblog: false, reply: true, direct: false } });
    const status = fromJS({ reblog: null, in_reply_to_id: '1234', visibility: 'public' });
    expect(shouldFilter(status, columnSettings)).toBe(false);
  });

  it('multiple settings', () => {
    const columnSettings = fromJS({ shows: { reblog: true, reply: false, direct: true } });
    const status = fromJS({ reblog: {}, in_reply_to_id: '1234', visibility: 'direct' });
    expect(shouldFilter(status, columnSettings)).toBe(true);
  });
});

import { Record as ImmutableRecord } from 'immutable';

import { normalizePoll } from '../poll';

describe('normalizePoll()', () => {
  it('adds base fields', () => {
    const poll = { options: [{ title: 'Apples' }] };
    const result = normalizePoll(poll);

    const expected = {
      options: [{ title: 'Apples', votes_count: 0 }],
      emojis: [],
      expired: false,
      multiple: false,
      voters_count: 0,
      votes_count: 0,
      own_votes: null,
      voted: false,
    };

    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(ImmutableRecord.isRecord(result.options.get(0))).toBe(true);
    expect(result.toJS()).toMatchObject(expected);
    expect(result.expires_at instanceof Date).toBe(true);
  });

  it('normalizes a Pleroma logged-out poll', () => {
    const { poll } = require('soapbox/__fixtures__/pleroma-status-with-poll.json');
    const result = normalizePoll(poll);

    // Adds logged-in fields
    expect(result.voted).toBe(false);
    expect(result.own_votes).toBe(null);
  });

  it('normalizes poll with emojis', () => {
    const { poll } = require('soapbox/__fixtures__/pleroma-status-with-poll-with-emojis.json');
    const result = normalizePoll(poll);

    // Emojifies poll options
    expect(result.options.get(1).title_emojified)
      .toEqual('Custom emoji <img draggable="false" class="emojione" alt=":gleason_excited:" title=":gleason_excited:" src="https://gleasonator.com/emoji/gleason_emojis/gleason_excited.png" /> ');

    // Parses emojis as Immutable.Record's
    expect(ImmutableRecord.isRecord(result.emojis.get(0))).toBe(true);
    expect(result.emojis.get(1).shortcode).toEqual('soapbox');
  });
});

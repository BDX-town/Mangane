import {
  sortEmoji,
  mergeEmojiFavourites,
  filterEmoji,
  oneEmojiPerAccount,
  reduceEmoji,
  getReactForStatus,
  simulateEmojiReact,
  simulateUnEmojiReact,
} from '../emoji_reacts';
import { fromJS } from 'immutable';

const ALLOWED_EMOJI = [
  '👍',
  '❤',
  '😂',
  '😯',
  '😢',
  '😡',
];

describe('filterEmoji', () => {
  describe('with a mix of allowed and disallowed emoji', () => {
    const emojiReacts = fromJS([
      { 'count': 1, 'me': true, 'name': '🌵' },
      { 'count': 1, 'me': true, 'name': '😂' },
      { 'count': 1, 'me': true, 'name': '👀' },
      { 'count': 1, 'me': true, 'name': '🍩' },
      { 'count': 1, 'me': true, 'name': '😡' },
      { 'count': 1, 'me': true, 'name': '🔪' },
      { 'count': 1, 'me': true, 'name': '😠' },
    ]);
    it('filters only allowed emoji', () => {
      expect(filterEmoji(emojiReacts, ALLOWED_EMOJI)).toEqual(fromJS([
        { 'count': 1, 'me': true, 'name': '😂' },
        { 'count': 1, 'me': true, 'name': '😡' },
      ]));
    });
  });
});

describe('sortEmoji', () => {
  describe('with an unsorted list of emoji', () => {
    const emojiReacts = fromJS([
      { 'count': 7,  'me': true, 'name': '😯' },
      { 'count': 3,  'me': true, 'name': '😢' },
      { 'count': 1,  'me': true, 'name': '😡' },
      { 'count': 20, 'me': true, 'name': '👍' },
      { 'count': 7,  'me': true, 'name': '😂' },
      { 'count': 15, 'me': true, 'name': '❤' },
    ]);
    it('sorts the emoji by count', () => {
      expect(sortEmoji(emojiReacts)).toEqual(fromJS([
        { 'count': 20, 'me': true, 'name': '👍' },
        { 'count': 15, 'me': true, 'name': '❤' },
        { 'count': 7,  'me': true, 'name': '😯' },
        { 'count': 7,  'me': true, 'name': '😂' },
        { 'count': 3,  'me': true, 'name': '😢' },
        { 'count': 1,  'me': true, 'name': '😡' },
      ]));
    });
  });
});

describe('mergeEmojiFavourites', () => {
  const favouritesCount = 12;
  const favourited = true;

  describe('with existing 👍 reacts', () => {
    const emojiReacts = fromJS([
      { 'count': 20, 'me': false, 'name': '👍' },
      { 'count': 15, 'me': false, 'name': '❤' },
      { 'count': 7,  'me': false, 'name': '😯' },
    ]);
    it('combines 👍 reacts with favourites', () => {
      expect(mergeEmojiFavourites(emojiReacts, favouritesCount, favourited)).toEqual(fromJS([
        { 'count': 32, 'me': true,  'name': '👍' },
        { 'count': 15, 'me': false, 'name': '❤' },
        { 'count': 7,  'me': false, 'name': '😯' },
      ]));
    });
  });

  describe('without existing 👍 reacts', () => {
    const emojiReacts = fromJS([
      { 'count': 15, 'me': false, 'name': '❤' },
      { 'count': 7,  'me': false, 'name': '😯' },
    ]);
    it('adds 👍 reacts to the map equaling favourite count', () => {
      expect(mergeEmojiFavourites(emojiReacts, favouritesCount, favourited)).toEqual(fromJS([
        { 'count': 15, 'me': false, 'name': '❤' },
        { 'count': 7,  'me': false, 'name': '😯' },
        { 'count': 12, 'me': true,  'name': '👍' },
      ]));
    });
    it('does not add 👍 reacts when there are no favourites', () => {
      expect(mergeEmojiFavourites(emojiReacts, 0, false)).toEqual(fromJS([
        { 'count': 15, 'me': false,  'name': '❤' },
        { 'count': 7,  'me': false,  'name': '😯' },
      ]));
    });
  });
});

describe('reduceEmoji', () => {
  describe('with a clusterfuck of emoji', () => {
    const emojiReacts = fromJS([
      { 'count': 1,  'me': false, 'name': '😡' },
      { 'count': 1,  'me': true,  'name': '🔪' },
      { 'count': 7,  'me': true,  'name': '😯' },
      { 'count': 3,  'me': false, 'name': '😢' },
      { 'count': 1,  'me': true,  'name': '🌵' },
      { 'count': 20, 'me': true,  'name': '👍' },
      { 'count': 7,  'me': false, 'name': '😂' },
      { 'count': 15, 'me': true,  'name': '❤' },
      { 'count': 1,  'me': false, 'name': '👀' },
      { 'count': 1,  'me': false, 'name': '🍩' },
    ]);
    it('sorts, filters, and combines emoji and favourites', () => {
      expect(reduceEmoji(emojiReacts, 7, true, ALLOWED_EMOJI)).toEqual(fromJS([
        { 'count': 27, 'me': true,  'name': '👍' },
        { 'count': 15, 'me': true,  'name': '❤' },
        { 'count': 7,  'me': true,  'name': '😯' },
        { 'count': 7,  'me': false, 'name': '😂' },
        { 'count': 3,  'me': false, 'name': '😢' },
        { 'count': 1,  'me': false, 'name': '😡' },
      ]));
    });
  });
});

describe('oneEmojiPerAccount', () => {
  it('reduces to one react per account', () => {
    const emojiReacts = fromJS([
      // Sorted
      { 'count': 2, 'me': true,  'name': '👍', accounts: [{ id: '1' }, { id: '2' }] },
      { 'count': 2, 'me': true,  'name': '❤', accounts: [{ id: '1' }, { id: '2' }] },
      { 'count': 1, 'me': true,  'name': '😯', accounts: [{ id: '1' }] },
      { 'count': 1, 'me': false, 'name': '😂', accounts: [{ id: '3' }] },
    ]);
    expect(oneEmojiPerAccount(emojiReacts, '1')).toEqual(fromJS([
      { 'count': 2, 'me': true,  'name': '👍', accounts: [{ id: '1' }, { id: '2' }] },
      { 'count': 1, 'me': false, 'name': '😂', accounts: [{ id: '3' }] },
    ]));
  });
});

describe('getReactForStatus', () => {
  it('returns a single owned react (including favourite) for the status', () => {
    const status = fromJS({
      favourited: false,
      pleroma: {
        emoji_reactions: [
          { 'count': 20, 'me': false, 'name': '👍' },
          { 'count': 15, 'me': true,  'name': '❤' },
          { 'count': 7,  'me': true,  'name': '😯' },
          { 'count': 7,  'me': false, 'name': '😂' },
        ],
      },
    });
    expect(getReactForStatus(status, ALLOWED_EMOJI)).toEqual('❤');
  });

  it('returns a thumbs-up for a favourite', () => {
    const status = fromJS({ favourites_count: 1, favourited: true });
    expect(getReactForStatus(status)).toEqual('👍');
  });

  it('returns undefined when a status has no reacts (or favourites)', () => {
    const status = fromJS([]);
    expect(getReactForStatus(status)).toEqual(undefined);
  });

  it('returns undefined when a status has no valid reacts (or favourites)', () => {
    const status = fromJS([
      { 'count': 1,  'me': true,  'name': '🔪' },
      { 'count': 1,  'me': true,  'name': '🌵' },
      { 'count': 1,  'me': false, 'name': '👀' },
      { 'count': 1,  'me': false, 'name': '🍩' },
    ]);
    expect(getReactForStatus(status)).toEqual(undefined);
  });
});

describe('simulateEmojiReact', () => {
  it('adds the emoji to the list', () => {
    const emojiReacts = fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 2, 'me': false, 'name': '❤' },
    ]);
    expect(simulateEmojiReact(emojiReacts, '❤')).toEqual(fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 3, 'me': true,  'name': '❤' },
    ]));
  });

  it('creates the emoji if it didn\'t already exist', () => {
    const emojiReacts = fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 2, 'me': false, 'name': '❤' },
    ]);
    expect(simulateEmojiReact(emojiReacts, '😯')).toEqual(fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 2, 'me': false, 'name': '❤' },
      { 'count': 1, 'me': true,  'name': '😯' },
    ]));
  });
});

describe('simulateUnEmojiReact', () => {
  it('removes the emoji from the list', () => {
    const emojiReacts = fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 3, 'me': true, 'name': '❤' },
    ]);
    expect(simulateUnEmojiReact(emojiReacts, '❤')).toEqual(fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 2, 'me': false,  'name': '❤' },
    ]));
  });

  it('removes the emoji if it\'s the last one in the list', () => {
    const emojiReacts = fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 2, 'me': false, 'name': '❤' },
      { 'count': 1, 'me': true,  'name': '😯' },
    ]);
    expect(simulateUnEmojiReact(emojiReacts, '😯')).toEqual(fromJS([
      { 'count': 2, 'me': false, 'name': '👍' },
      { 'count': 2, 'me': false, 'name': '❤' },
    ]));
  });
});

import {
  sortEmoji,
  mergeEmojiFavourites,
  filterEmoji,
  oneEmojiPerAccount,
  reduceEmoji,
  getReactForStatus,
} from '../emoji_reacts';
import { fromJS } from 'immutable';

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
      expect(filterEmoji(emojiReacts)).toEqual(fromJS([
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

  describe('with existing 👍 reacts', () => {
    const emojiReacts = fromJS([
      { 'count': 20, 'me': true, 'name': '👍' },
      { 'count': 15, 'me': true, 'name': '❤' },
      { 'count': 7,  'me': true, 'name': '😯' },
    ]);
    it('combines 👍 reacts with favourites', () => {
      expect(mergeEmojiFavourites(emojiReacts, favouritesCount)).toEqual(fromJS([
        { 'count': 32, 'me': true, 'name': '👍' },
        { 'count': 15, 'me': true, 'name': '❤' },
        { 'count': 7,  'me': true, 'name': '😯' },
      ]));
    });
  });

  describe('without existing 👍 reacts', () => {
    const emojiReacts = fromJS([
      { 'count': 15, 'me': true, 'name': '❤' },
      { 'count': 7,  'me': true, 'name': '😯' },
    ]);
    it('adds 👍 reacts to the map equaling favourite count', () => {
      expect(mergeEmojiFavourites(emojiReacts, favouritesCount)).toEqual(fromJS([
        { 'count': 15, 'me': true,  'name': '❤' },
        { 'count': 7,  'me': true,  'name': '😯' },
        { 'count': 12, 'me': false, 'name': '👍' },
      ]));
    });
    it('does not add 👍 reacts when there are no favourites', () => {
      expect(mergeEmojiFavourites(emojiReacts, 0)).toEqual(fromJS([
        { 'count': 15, 'me': true,  'name': '❤' },
        { 'count': 7,  'me': true,  'name': '😯' },
      ]));
    });
  });
});

describe('reduceEmoji', () => {
  describe('with a clusterfuck of emoji', () => {
    const emojiReacts = fromJS([
      { 'count': 1,  'me': false, 'name': '😡', accounts: [{ id: '2' }] },
      { 'count': 1,  'me': true,  'name': '🔪', accounts: [{ id: '1' }] },
      { 'count': 7,  'me': true,  'name': '😯', accounts: [{ id: '1' }, { id: '17' }, { id: '18' }, { id: '19' }, { id: '20' }, { id: '21' }, { id: '22' }] },
      { 'count': 3,  'me': false, 'name': '😢', accounts: [{ id: '49' }, { id: '50' }, { id: '51' }] },
      { 'count': 1,  'me': true,  'name': '🌵', accounts: [{ id: '1' }] },
      { 'count': 20, 'me': true,  'name': '👍', accounts: [{ id: '1' }, { id: '23' }, { id: '24' }, { id: '25' }, { id: '26' }, { id: '27' }, { id: '28' }, { id: '29' }, { id: '30' }, { id: '31' }, { id: '32' }, { id: '33' }, { id: '34' }, { id: '35' }, { id: '36' }, { id: '37' }, { id: '38' }, { id: '39' }, { id: '40' }, { id: '41' }] },
      { 'count': 7,  'me': false, 'name': '😂', accounts: [{ id: '42' }, { id: '43' }, { id: '44' }, { id: '45' }, { id: '46' }, { id: '47' }, { id: '48' }] },
      { 'count': 15, 'me': true,  'name': '❤', accounts: [{ id: '1' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }, { id: '10' }, { id: '11' }, { id: '12' }, { id: '13' }, { id: '14' }, { id: '15' }, { id: '16' }] },
      { 'count': 1,  'me': false, 'name': '👀', accounts: [{ id: '52' }] },
      { 'count': 1,  'me': false, 'name': '🍩', accounts: [{ id: '53' }] },
    ]);
    it('sorts, filters, and combines emoji and favourites', () => {
      expect(reduceEmoji(emojiReacts, 7, '1')).toEqual(fromJS([
        { 'count': 27, 'me': true,  'name': '👍', accounts: [{ id: '1' }, { id: '23' }, { id: '24' }, { id: '25' }, { id: '26' }, { id: '27' }, { id: '28' }, { id: '29' }, { id: '30' }, { id: '31' }, { id: '32' }, { id: '33' }, { id: '34' }, { id: '35' }, { id: '36' }, { id: '37' }, { id: '38' }, { id: '39' }, { id: '40' }, { id: '41' }] },
        { 'count': 14, 'me': false, 'name': '❤', accounts: [{ id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }, { id: '10' }, { id: '11' }, { id: '12' }, { id: '13' }, { id: '14' }, { id: '15' }, { id: '16' }] },
        { 'count': 7,  'me': false, 'name': '😂', accounts: [{ id: '42' }, { id: '43' }, { id: '44' }, { id: '45' }, { id: '46' }, { id: '47' }, { id: '48' }] },
        { 'count': 6,  'me': false, 'name': '😯', accounts: [{ id: '17' }, { id: '18' }, { id: '19' }, { id: '20' }, { id: '21' }, { id: '22' }] },
        { 'count': 3,  'me': false, 'name': '😢', accounts: [{ id: '49' }, { id: '50' }, { id: '51' }] },
        { 'count': 1,  'me': false, 'name': '😡', accounts: [{ id: '2' }] },
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
    expect(getReactForStatus(status)).toEqual('❤');
  });

  it('returns a thumbs-up for a favourite', () => {
    const status = fromJS({ favourited: true });
    expect(getReactForStatus(status)).toEqual('👍');
  });
});

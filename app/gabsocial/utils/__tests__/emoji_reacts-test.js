import {
  sortEmoji,
  mergeEmojiFavourites,
  filterEmoji,
  reduceEmoji,
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
      { 'count': 15, 'me': true, 'name': '❤️' },
    ]);
    it('sorts the emoji by count', () => {
      expect(sortEmoji(emojiReacts)).toEqual(fromJS([
        { 'count': 20, 'me': true, 'name': '👍' },
        { 'count': 15, 'me': true, 'name': '❤️' },
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
      { 'count': 15, 'me': true, 'name': '❤️' },
      { 'count': 7,  'me': true, 'name': '😯' },
    ]);
    it('combines 👍 reacts with favourites', () => {
      expect(mergeEmojiFavourites(emojiReacts, favouritesCount)).toEqual(fromJS([
        { 'count': 32, 'me': true, 'name': '👍' },
        { 'count': 15, 'me': true, 'name': '❤️' },
        { 'count': 7,  'me': true, 'name': '😯' },
      ]));
    });
  });

  describe('without existing 👍 reacts', () => {
    const emojiReacts = fromJS([
      { 'count': 15, 'me': true, 'name': '❤️' },
      { 'count': 7,  'me': true, 'name': '😯' },
    ]);
    it('adds 👍 reacts to the map equaling favourite count', () => {
      expect(mergeEmojiFavourites(emojiReacts, favouritesCount)).toEqual(fromJS([
        { 'count': 15, 'me': true,  'name': '❤️' },
        { 'count': 7,  'me': true,  'name': '😯' },
        { 'count': 12, 'me': false, 'name': '👍' },
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
      { 'count': 15, 'me': true,  'name': '❤️' },
      { 'count': 1,  'me': false, 'name': '👀' },
      { 'count': 1,  'me': false, 'name': '🍩' },
    ]);
    it('sorts, filters, and combines emoji and favourites', () => {
      expect(reduceEmoji(emojiReacts, 7)).toEqual(fromJS([
        { 'count': 27, 'me': true,  'name': '👍' },
        { 'count': 15, 'me': true,  'name': '❤️' },
        { 'count': 7,  'me': true,  'name': '😯' },
        { 'count': 7,  'me': false, 'name': '😂' },
        { 'count': 3,  'me': false, 'name': '😢' },
        { 'count': 1,  'me': false, 'name': '😡' },
      ]));
    });
  });
});

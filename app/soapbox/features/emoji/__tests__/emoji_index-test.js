import { pick } from 'lodash';
import { emojiIndex } from 'emoji-mart';
import { search } from '../emoji_mart_search_light';

const trimEmojis = emoji => pick(emoji, ['id', 'unified', 'native', 'custom']);

describe('emoji_index', () => {
  it('should give same result for emoji_index_light and emoji-mart', () => {
    const expected = [
      {
        id: 'pineapple',
        unified: '1f34d',
        native: '🍍',
      },
    ];
    expect(search('pineapple').map(trimEmojis)).toEqual(expected);
    expect(emojiIndex.search('pineapple').map(trimEmojis)).toEqual(expected);
  });

  it('orders search results correctly', () => {
    const expected = [
      {
        id: 'apple',
        unified: '1f34e',
        native: '🍎',
      },
      {
        id: 'pineapple',
        unified: '1f34d',
        native: '🍍',
      },
      {
        id: 'green_apple',
        unified: '1f34f',
        native: '🍏',
      },
      {
        id: 'iphone',
        unified: '1f4f1',
        native: '📱',
      },
    ];
    expect(search('apple').map(trimEmojis)).toEqual(expected);
    expect(emojiIndex.search('apple').map(trimEmojis)).toEqual(expected);
  });

  it('can include/exclude categories', () => {
    expect(search('flag', { include: ['people'] })).toEqual([]);
    expect(emojiIndex.search('flag', { include: ['people'] })).toEqual([]);
  });

  it('(different behavior from emoji-mart) do not erases custom emoji if not passed again', () => {
    const custom = [
      {
        id: 'soapbox',
        name: 'soapbox',
        short_names: ['soapbox'],
        text: '',
        emoticons: [],
        keywords: ['soapbox'],
        imageUrl: 'http://example.com',
        custom: true,
      },
    ];
    search('', { custom });
    emojiIndex.search('', { custom });
    const expected = [];
    const lightExpected = [
      {
        id: 'soapbox',
        custom: true,
      },
    ];
    expect(search('soap').map(trimEmojis)).toEqual(lightExpected);
    expect(emojiIndex.search('soap').map(trimEmojis)).toEqual(expected);
  });

  it('(different behavior from emoji-mart) erases custom emoji if another is passed', () => {
    const custom = [
      {
        id: 'soapbox',
        name: 'soapbox',
        short_names: ['soapbox'],
        text: '',
        emoticons: [],
        keywords: ['soapbox'],
        imageUrl: 'http://example.com',
        custom: true,
      },
    ];
    search('', { custom });
    emojiIndex.search('', { custom });
    const expected = [];
    expect(search('soap', { custom: [] }).map(trimEmojis)).toEqual(expected);
    expect(emojiIndex.search('soap').map(trimEmojis)).toEqual(expected);
  });

  it('handles custom emoji', () => {
    const custom = [
      {
        id: 'soapbox',
        name: 'soapbox',
        short_names: ['soapbox'],
        text: '',
        emoticons: [],
        keywords: ['soapbox'],
        imageUrl: 'http://example.com',
        custom: true,
      },
    ];
    search('', { custom });
    emojiIndex.search('', { custom });
    const expected = [
      {
        id: 'soapbox',
        custom: true,
      },
    ];
    expect(search('soap', { custom }).map(trimEmojis)).toEqual(expected);
    expect(emojiIndex.search('soap', { custom }).map(trimEmojis)).toEqual(expected);
  });

  it('should filter only emojis we care about, exclude pineapple', () => {
    const emojisToShowFilter = emoji => emoji.unified !== '1F34D';
    expect(search('apple', { emojisToShowFilter }).map((obj) => obj.id))
      .not.toContain('pineapple');
    expect(emojiIndex.search('apple', { emojisToShowFilter }).map((obj) => obj.id))
      .not.toContain('pineapple');
  });

  it('does an emoji whose unified name is irregular', () => {
    const expected = [
      {
        'id': 'water_polo',
        'unified': '1f93d',
        'native': '🤽',
      },
      {
        'id': 'man-playing-water-polo',
        'unified': '1f93d-200d-2642-fe0f',
        'native': '🤽‍♂️',
      },
      {
        'id': 'woman-playing-water-polo',
        'unified': '1f93d-200d-2640-fe0f',
        'native': '🤽‍♀️',
      },
    ];
    expect(search('polo').map(trimEmojis)).toEqual(expected);
    expect(emojiIndex.search('polo').map(trimEmojis)).toEqual(expected);
  });

  it('can search for thinking_face', () => {
    const expected = [
      {
        id: 'thinking_face',
        unified: '1f914',
        native: '🤔',
      },
    ];
    expect(search('thinking_fac').map(trimEmojis)).toEqual(expected);
    expect(emojiIndex.search('thinking_fac').map(trimEmojis)).toEqual(expected);
  });

  it('can search for woman-facepalming', () => {
    const expected = [
      {
        id: 'woman-facepalming',
        unified: '1f926-200d-2640-fe0f',
        native: '🤦‍♀️',
      },
    ];
    expect(search('woman-facep').map(trimEmojis)).toEqual(expected);
    expect(emojiIndex.search('woman-facep').map(trimEmojis)).toEqual(expected);
  });
});

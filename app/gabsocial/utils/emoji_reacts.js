import { Map as ImmutableMap } from 'immutable';

// https://emojipedia.org/facebook/
export const ALLOWED_EMOJI = [
  '👍',
  '❤',
  '😂',
  '😯',
  '😢',
  '😡',
];

export const sortEmoji = emojiReacts => (
  emojiReacts.sortBy(emojiReact => -emojiReact.get('count'))
);

export const mergeEmoji = emojiReacts => (
  emojiReacts // TODO: Merge similar emoji
);

export const mergeEmojiFavourites = (emojiReacts, favouritesCount) => {
  if (!favouritesCount) return emojiReacts;
  const likeIndex = emojiReacts.findIndex(emojiReact =>
    emojiReact.get('name') === '👍');
  if (likeIndex > -1) {
    const likeCount = emojiReacts.getIn([likeIndex, 'count']);
    return emojiReacts.setIn([likeIndex, 'count'], likeCount + favouritesCount);
  } else {
    return emojiReacts.push(ImmutableMap({ count: favouritesCount, me: false, name: '👍' }));
  }
};

export const oneEmojiPerAccount = emojiReacts => {
  return; // TODO
};

export const filterEmoji = emojiReacts => (
  emojiReacts.filter(emojiReact => (
    ALLOWED_EMOJI.includes(emojiReact.get('name'))
  )));

export const reduceEmoji = (emojiReacts, favouritesCount) => (
  sortEmoji(filterEmoji(mergeEmoji(mergeEmojiFavourites(
    emojiReacts, favouritesCount
  )))));

export const getReactForStatus = status => {
  return; // TODO
};

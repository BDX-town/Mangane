import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';

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

export const mergeEmojiFavourites = (emojiReacts, favouritesCount, favourited) => {
  if (!favouritesCount) return emojiReacts;
  const likeIndex = emojiReacts.findIndex(emojiReact => emojiReact.get('name') === '👍');
  if (likeIndex > -1) {
    const likeCount = emojiReacts.getIn([likeIndex, 'count']);
    favourited = favourited || emojiReacts.getIn([likeIndex, 'me'], false);
    return emojiReacts
      .setIn([likeIndex, 'count'], likeCount + favouritesCount)
      .setIn([likeIndex, 'me'], favourited);
  } else {
    return emojiReacts.push(ImmutableMap({ count: favouritesCount, me: favourited, name: '👍' }));
  }
};

const hasMultiReactions = (emojiReacts, account) => (
  emojiReacts.filter(
    e => e.get('accounts').filter(
      a => a.get('id') === account.get('id')
    ).count() > 0
  ).count() > 1
);

const inAccounts = (accounts, id) => (
  accounts.filter(a => a.get('id') === id).count() > 0
);

export const oneEmojiPerAccount = (emojiReacts, me) => {
  emojiReacts = emojiReacts.reverse();

  return emojiReacts.reduce((acc, cur, idx) => {
    const accounts = cur.get('accounts', ImmutableList())
      .filter(a => !hasMultiReactions(acc, a));

    return acc.set(idx, cur.merge({
      accounts: accounts,
      count: accounts.count(),
      me: me ? inAccounts(accounts, me) : false,
    }));
  }, emojiReacts)
    .filter(e => e.get('count') > 0)
    .reverse();
};

export const filterEmoji = emojiReacts => (
  emojiReacts.filter(emojiReact => (
    ALLOWED_EMOJI.includes(emojiReact.get('name'))
  )));

export const reduceEmoji = (emojiReacts, favouritesCount, favourited) => (
  filterEmoji(sortEmoji(mergeEmoji(mergeEmojiFavourites(
    emojiReacts, favouritesCount, favourited
  )))));

export const getReactForStatus = status => {
  return reduceEmoji(
    status.getIn(['pleroma', 'emoji_reactions'], ImmutableList()),
    status.get('favourites_count'),
    status.get('favourited')
  ).filter(e => e.get('me'))
    .first(ImmutableMap())
    .get('name');
};

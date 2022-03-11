import escapeTextContentForBrowser from 'escape-html';

import emojify from '../../features/emoji/emoji';
import { unescapeHTML } from '../../utils/html';

const makeEmojiMap = record => record.emojis.reduce((obj, emoji) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

export function normalizeAccount(account) {
  account = { ...account };

  // Some backends can return null, or omit these required fields
  if (!account.emojis) account.emojis = [];
  if (!account.display_name) account.display_name = '';
  if (!account.note) account.note = '';
  if (!account.avatar) account.avatar = account.avatar_static || require('images/avatar-missing.png');
  if (!account.avatar_static) account.avatar_static = account.avatar;

  const emojiMap = makeEmojiMap(account);
  const displayName = account.display_name.trim().length === 0 ? account.username : account.display_name;

  account.display_name_html = emojify(escapeTextContentForBrowser(displayName), emojiMap);
  account.note_emojified = emojify(account.note, emojiMap);
  account.note_plain = unescapeHTML(account.note);

  if (account.fields) {
    account.fields = account.fields.map(pair => ({
      ...pair,
      name_emojified: emojify(escapeTextContentForBrowser(pair.name)),
      value_emojified: emojify(pair.value, emojiMap),
      value_plain: unescapeHTML(pair.value),
    }));
  }

  if (account.moved) {
    account.moved = account.moved.id;
  }

  return account;
}

export function normalizeChat(chat, normalOldChat) {
  const normalChat   = { ...chat };
  const { account, last_message: lastMessage } = chat;

  if (account) normalChat.account = account.id;
  if (lastMessage) normalChat.last_message = lastMessage.id;

  return normalChat;
}

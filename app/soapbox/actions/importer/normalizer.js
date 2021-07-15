import escapeTextContentForBrowser from 'escape-html';
import emojify from '../../features/emoji/emoji';

const domParser = new DOMParser();

const makeEmojiMap = record => record.emojis.reduce((obj, emoji) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

export function normalizeStatus(status, normalOldStatus, expandSpoilers) {
  const normalStatus   = { ...status };

  normalStatus.account = status.account.id;

  if (status.reblog && status.reblog.id) {
    normalStatus.reblog = status.reblog.id;
  }

  if (status.poll && status.poll.id) {
    normalStatus.poll = status.poll.id;
  }

  // Only calculate these values when status first encountered
  // Otherwise keep the ones already in the reducer
  if (normalOldStatus) {
    normalStatus.search_index = normalOldStatus.get('search_index');
    normalStatus.contentHtml = normalOldStatus.get('contentHtml');
    normalStatus.spoilerHtml = normalOldStatus.get('spoilerHtml');
    normalStatus.hidden = normalOldStatus.get('hidden');
  } else {
    const spoilerText   = normalStatus.spoiler_text || '';
    const searchContent = [spoilerText, status.content].join('\n\n').replace(/<br\s*\/?>/g, '\n').replace(/<\/p><p>/g, '\n\n');
    const emojiMap      = makeEmojiMap(normalStatus);

    normalStatus.search_index = domParser.parseFromString(searchContent, 'text/html').documentElement.textContent;
    normalStatus.contentHtml  = emojify(normalStatus.content, emojiMap);
    normalStatus.spoilerHtml  = emojify(escapeTextContentForBrowser(spoilerText), emojiMap);
    normalStatus.hidden       = expandSpoilers ? false : spoilerText.length > 0 || normalStatus.sensitive;
  }

  return normalStatus;
}

export function normalizePoll(poll) {
  const normalPoll = { ...poll };

  const emojiMap = makeEmojiMap(normalPoll);

  normalPoll.options = poll.options.map(option => ({
    ...option,
    title_emojified: emojify(escapeTextContentForBrowser(option.title), emojiMap),
  }));

  return normalPoll;
}

export function normalizeChat(chat, normalOldChat) {
  const normalChat   = { ...chat };
  const { account, last_message: lastMessage } = chat;

  if (account) normalChat.account = account.id;
  if (lastMessage) normalChat.last_message = lastMessage.id;

  return normalChat;
}

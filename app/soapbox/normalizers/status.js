import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import { accountToMention } from 'soapbox/utils/accounts';

// Some backends can return null, or omit these required fields
const baseStatus = ImmutableMap({
  application: null,
  bookmarked: false,
  card: null,
  created_at: new Date(),
  emojis: ImmutableList(),
  favourited: false,
  favourites_count: 0,
  in_reply_to_account_id: null,
  in_reply_to_id: null,
  language: null,
  mentions: ImmutableList(),
  muted: false,
  pinned: false,
  reblog: null,
  reblogged: false,
  reblogs_count: 0,
  replies_count: 0,
  spoiler_text: '',
  tags: ImmutableList(),
  uri: '',
  url: '',
  visibility: 'public',
});

const mergeDefined = (oldVal, newVal) => oldVal === undefined ? newVal : oldVal;

const setRequiredFields = status => {
  return status.mergeDeepWith(mergeDefined, baseStatus);
};

// Ensure attachments have required fields
// https://docs.joinmastodon.org/entities/attachment/
const normalizeAttachment = attachment => {
  const url = [
    attachment.get('url'),
    attachment.get('preview_url'),
    attachment.get('remote_url'),
  ].find(url => url) || '';

  const base = ImmutableMap({
    url,
    preview_url: url,
    remote_url: url,
  });

  return attachment.mergeWith((o, n) => o || n, base);
};

const normalizeAttachments = status => {
  return status.update('media_attachments', ImmutableList(), attachments => {
    return attachments.map(normalizeAttachment);
  });
};

// Fix order of mentions
const fixMentions = status => {
  const mentions = status.get('mentions');
  const inReplyToAccountId = status.get('in_reply_to_account_id');

  // Sort the replied-to mention to the top
  const sorted = mentions.sort((a, b) => {
    if (a.get('id') === inReplyToAccountId) {
      return -1;
    } else {
      return 0;
    }
  });

  return status.set('mentions', sorted);
};

// Add self to mentions if it's a reply to self
const addSelfMention = status => {
  const accountId = status.getIn(['account', 'id']);

  const isSelfReply = accountId === status.get('in_reply_to_account_id');
  const hasSelfMention = accountId === status.getIn(['mentions', 0, 'id']);

  if (isSelfReply && !hasSelfMention) {
    const mention = accountToMention(status.get('account'));
    return status.update('mentions', ImmutableList(), mentions => (
      ImmutableList([mention]).concat(mentions)
    ));
  } else {
    return status;
  }
};

// Move the quote to the top-level
const fixQuote = status => {
  return status.withMutations(status => {
    status.update('quote', quote => quote || status.getIn(['pleroma', 'quote']) || null);
    status.deleteIn(['pleroma', 'quote']);
  });
};

export const normalizeStatus = status => {
  return status.withMutations(status => {
    setRequiredFields(status);
    fixMentions(status);
    fixQuote(status);
    addSelfMention(status);
    normalizeAttachments(status);
  });
};

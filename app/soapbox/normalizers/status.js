import { Map as ImmutableMap, List as ImmutableList, Record } from 'immutable';

import { accountToMention } from 'soapbox/utils/accounts';
import { mergeDefined } from 'soapbox/utils/normalizers';

const StatusRecord = Record({
  account: ImmutableMap(),
  application: null,
  bookmarked: false,
  card: null,
  created_at: new Date(),
  emojis: ImmutableList(),
  favourited: false,
  favourites_count: 0,
  in_reply_to_account_id: null,
  in_reply_to_id: null,
  id: '',
  language: null,
  media_attachments: ImmutableList(),
  mentions: ImmutableList(),
  muted: false,
  pinned: false,
  pleroma: ImmutableMap(),
  poll: null,
  quote: null,
  reblog: null,
  reblogged: false,
  reblogs_count: 0,
  replies_count: 0,
  sensitive: false,
  spoiler_text: '',
  tags: ImmutableList(),
  uri: '',
  url: '',
  visibility: 'public',

  // Internal fields
  contentHtml: '',
  hidden: false,
  search_index: '',
  spoilerHtml: '',
});

const basePollOption = ImmutableMap({ title: '', votes_count: 0 });

const basePoll = ImmutableMap({
  emojis: ImmutableList(),
  expired: false,
  expires_at: new Date(Date.now() + 1000 * (60 * 5)), // 5 minutes
  multiple: false,
  options: ImmutableList(),
  voters_count: 0,
  votes_count: 0,
});

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

  return attachment.mergeWith(mergeDefined, base);
};

const normalizeAttachments = status => {
  return status.update('media_attachments', ImmutableList(), attachments => {
    return attachments.map(normalizeAttachment);
  });
};

// Normalize mentions
const normalizeMention = mention => {
  const base = ImmutableMap({
    acct: '',
    username: (mention.get('acct') || '').split('@')[0],
    url: '',
  });

  return mention.mergeWith(mergeDefined, base);
};

const normalizeMentions = status => {
  return status.update('mentions', ImmutableList(), mentions => {
    return mentions.map(normalizeMention);
  });
};

// Normalize poll option
const normalizePollOption = option => {
  return option.mergeWith(mergeDefined, basePollOption);
};

// Normalize poll
const normalizePoll = status => {
  if (status.hasIn(['poll', 'options'])) {
    return status.update('poll', ImmutableMap(), poll => {
      return poll.mergeWith(mergeDefined, basePoll).update('options', options => {
        return options.map(normalizePollOption);
      });
    });
  } else {
    return status.set('poll', null);
  }
};
// Fix order of mentions
const fixMentionsOrder = status => {
  const mentions = status.get('mentions', ImmutableList());
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
  return StatusRecord(
    status.withMutations(status => {
      normalizeAttachments(status);
      normalizeMentions(status);
      normalizePoll(status);
      fixMentionsOrder(status);
      addSelfMention(status);
      fixQuote(status);
    }),
  );
};

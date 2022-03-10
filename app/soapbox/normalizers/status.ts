import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
} from 'immutable';

import { IStatus } from 'soapbox/types';
import { accountToMention } from 'soapbox/utils/accounts';
import { mergeDefined } from 'soapbox/utils/normalizers';

const StatusRecord = ImmutableRecord({
  account: ImmutableMap(),
  application: null,
  bookmarked: false,
  card: null,
  content: '',
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

const PollOptionRecord = ImmutableRecord({
  title: '',
  votes_count: 0,
});

// https://docs.joinmastodon.org/entities/poll/
const PollRecord = ImmutableRecord({
  emojis: ImmutableList(),
  expired: false,
  expires_at: new Date(),
  id: '',
  multiple: false,
  options: ImmutableList(),
  voters_count: 0,
  votes_count: 0,
  own_votes: null,
  voted: false,
});

// Ensure attachments have required fields
// https://docs.joinmastodon.org/entities/attachment/
const normalizeAttachment = (attachment: ImmutableMap<string, any>) => {
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

const normalizeAttachments = (status: ImmutableMap<string, any>) => {
  return status.update('media_attachments', ImmutableList(), attachments => {
    return attachments.map(normalizeAttachment);
  });
};

// Normalize mentions
const normalizeMention = (mention: ImmutableMap<string, any>) => {
  const base = ImmutableMap({
    acct: '',
    username: (mention.get('acct') || '').split('@')[0],
    url: '',
  });

  return mention.mergeWith(mergeDefined, base);
};

const normalizeMentions = (status: ImmutableMap<string, any>) => {
  return status.update('mentions', ImmutableList(), mentions => {
    return mentions.map(normalizeMention);
  });
};

// Normalize poll options
const normalizePollOptions = (poll: ImmutableMap<string, any>) => {
  return poll.update('options', (options: ImmutableList<ImmutableMap<string, any>>) => {
    return options.map(PollOptionRecord);
  });
};

// Normalize own_votes to `null` if empty (like Mastodon)
const normalizePollOwnVotes = (poll: ImmutableMap<string, any>) => {
  return poll.update('own_votes', ownVotes => {
    return ownVotes?.size > 0 ? ownVotes : null;
  });
};

// Whether the user voted in the poll
const normalizePollVoted = (poll: ImmutableMap<string, any>) => {
  return poll.update('voted', voted => {
    return typeof voted === 'boolean' ? voted : poll.get('own_votes')?.size > 0;
  });
};

// Normalize the actual poll
const normalizePoll = (poll: ImmutableMap<string, any>) => {
  return PollRecord(
    poll.withMutations((poll: ImmutableMap<string, any>) => {
      normalizePollOptions(poll);
      normalizePollOwnVotes(poll);
      normalizePollVoted(poll);
    }),
  );
};

// Normalize the poll in the status, if applicable
const normalizeStatusPoll = (status: ImmutableMap<string, any>) => {
  if (status.hasIn(['poll', 'options'])) {
    return status.update('poll', ImmutableMap(), normalizePoll);
  } else {
    return status.set('poll', null);
  }
};

// Fix order of mentions
const fixMentionsOrder = (status: ImmutableMap<string, any>) => {
  const mentions = status.get('mentions', ImmutableList());
  const inReplyToAccountId = status.get('in_reply_to_account_id');

  // Sort the replied-to mention to the top
  const sorted = mentions.sort((a: ImmutableMap<string, any>, _b: ImmutableMap<string, any>) => {
    if (a.get('id') === inReplyToAccountId) {
      return -1;
    } else {
      return 0;
    }
  });

  return status.set('mentions', sorted);
};

// Add self to mentions if it's a reply to self
const addSelfMention = (status: ImmutableMap<string, any>) => {
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
const fixQuote = (status: ImmutableMap<string, any>) => {
  return status.withMutations(status => {
    status.update('quote', quote => quote || status.getIn(['pleroma', 'quote']) || null);
    status.deleteIn(['pleroma', 'quote']);
  });
};

export const normalizeStatus = (status: ImmutableMap<string, any>): IStatus => {
  return StatusRecord(
    status.withMutations(status => {
      normalizeAttachments(status);
      normalizeMentions(status);
      normalizeStatusPoll(status);
      fixMentionsOrder(status);
      addSelfMention(status);
      fixQuote(status);
    }),
  );
};

/**
 * Poll normalizer:
 * Converts API polls into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/poll/}
 */
import escapeTextContentForBrowser from 'escape-html';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import emojify from 'soapbox/features/emoji/emoji';
import { normalizeEmoji } from 'soapbox/normalizers/emoji';
import { makeEmojiMap } from 'soapbox/utils/normalizers';

import type { Emoji, PollOption } from 'soapbox/types/entities';

// https://docs.joinmastodon.org/entities/poll/
export const PollRecord = ImmutableRecord({
  emojis: ImmutableList<Emoji>(),
  expired: false,
  expires_at: new Date(),
  id: '',
  multiple: false,
  options: ImmutableList<PollOption>(),
  voters_count: 0,
  votes_count: 0,
  own_votes: null as ImmutableList<number> | null,
  voted: false,
});

// Sub-entity of Poll
export const PollOptionRecord = ImmutableRecord({
  title: '',
  votes_count: 0,

  // Internal fields
  title_emojified: '',
});

// Normalize emojis
const normalizeEmojis = (entity: ImmutableMap<string, any>) => {
  return entity.update('emojis', ImmutableList(), emojis => {
    return emojis.map(normalizeEmoji);
  });
};

const normalizePollOption = (option: ImmutableMap<string, any>, emojis: ImmutableList<ImmutableMap<string, string>> = ImmutableList()) => {
  const emojiMap = makeEmojiMap(emojis);
  const titleEmojified = emojify(escapeTextContentForBrowser(option.get('title')), emojiMap);

  return PollOptionRecord(
    option.set('title_emojified', titleEmojified),
  );
};

// Normalize poll options
const normalizePollOptions = (poll: ImmutableMap<string, any>) => {
  const emojis = poll.get('emojis');

  return poll.update('options', (options: ImmutableList<ImmutableMap<string, any>>) => {
    return options.map(option => normalizePollOption(option, emojis));
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

export const normalizePoll = (poll: Record<string, any>) => {
  return PollRecord(
    ImmutableMap(fromJS(poll)).withMutations((poll: ImmutableMap<string, any>) => {
      normalizeEmojis(poll);
      normalizePollOptions(poll);
      normalizePollOwnVotes(poll);
      normalizePollVoted(poll);
    }),
  );
};

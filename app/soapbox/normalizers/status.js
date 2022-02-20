import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

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

export const normalizeStatus = status => {
  return status.withMutations(status => {
    fixMentions(status);
    normalizeAttachments(status);
  });
};

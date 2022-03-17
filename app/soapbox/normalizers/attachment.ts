/**
 * Attachment normalizer:
 * Converts API attachments into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/attachment/}
 */
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import { mergeDefined } from 'soapbox/utils/normalizers';

// https://docs.joinmastodon.org/entities/attachment/
export const AttachmentRecord = ImmutableRecord({
  blurhash: undefined,
  description: '',
  id: '',
  meta: ImmutableMap(),
  pleroma: ImmutableMap(),
  preview_url: '',
  remote_url: null,
  type: 'unknown',
  url: '',

  // Internal fields
  // TODO: Remove these? They're set in selectors/index.js
  account: null,
  status: null,
});

const normalizeUrls = (attachment: ImmutableMap<string, any>) => {
  const url = [
    attachment.get('url'),
    attachment.get('preview_url'),
    attachment.get('remote_url'),
  ].find(url => url) || '';

  const base = ImmutableMap({
    url,
    preview_url: url,
  });

  return attachment.mergeWith(mergeDefined, base);
};

// Ensure attachments have required fields
export const normalizeAttachment = (attachment: Record<string, any>) => {
  return AttachmentRecord(
    normalizeUrls(ImmutableMap(fromJS(attachment))),
  );
};

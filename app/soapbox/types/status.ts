/**
 * Status entity.
 * https://docs.joinmastodon.org/entities/status/
 **/

interface IStatus {
  account: Record<any, any>;
  application: Record<string, any> | null;
  bookmarked: boolean;
  card: Record<string, any> | null;
  content: string;
  created_at: Date;
  emojis: Iterable<any>;
  favourited: boolean;
  favourites_count: number;
  in_reply_to_account_id: string | null;
  in_reply_to_id: string | null;
  id: string;
  language: null;
  media_attachments: Iterable<any>;
  mentions: Iterable<any>;
  muted: boolean;
  pinned: boolean;
  pleroma: Record<string, any>;
  poll: null;
  quote: null;
  reblog: null;
  reblogged: boolean;
  reblogs_count: number;
  replies_count: number;
  sensitive: boolean;
  spoiler_text: string;
  tags: Iterable<any>;
  uri: string;
  url: string;
  visibility: string;

  // Internal fields
  contentHtml: string;
  hidden: boolean;
  search_index: string;
  spoilerHtml: string;
}

export { IStatus };

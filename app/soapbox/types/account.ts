/**
 * Account entity.
 * https://docs.joinmastodon.org/entities/account/
 **/

interface IAccount {
  acct: string;
  avatar: string;
  avatar_static: string;
  birthday: Date | undefined;
  bot: boolean;
  created_at: Date;
  display_name: string;
  emojis: Iterable<any>;
  fields: Iterable<any>;
  followers_count: number;
  following_count: number;
  fqn: string;
  header: string;
  header_static: string;
  id: string;
  last_status_at: Date;
  location: string;
  locked: boolean;
  moved: null;
  note: string;
  pleroma: Record<any, any>;
  source: Record<any, any>;
  statuses_count: number;
  uri: string;
  url: string;
  username: string;
  verified: boolean;

  // Internal fields
  display_name_html: string;
  note_emojified: string;
  note_plain: string;
  patron: Record<any, any>;
  relationship: Iterable<any>;
  should_refetch: boolean;
}

export { IAccount };

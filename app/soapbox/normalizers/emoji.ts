import { Record as ImmutableRecord, Map as ImmutableMap } from 'immutable';

// https://docs.joinmastodon.org/entities/emoji/
const EmojiRecord = ImmutableRecord({
  category: '',
  shortcode: '',
  static_url: '',
  url: '',
  visible_in_picker: true,
});

export const normalizeEmoji = (emoji: ImmutableMap<string, any>) => {
  return EmojiRecord(emoji);
};

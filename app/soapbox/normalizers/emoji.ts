/**
 * Emoji normalizer:
 * Converts API emojis into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/emoji/}
 */
import { Record as ImmutableRecord, Map as ImmutableMap, fromJS } from 'immutable';

// https://docs.joinmastodon.org/entities/emoji/
export const EmojiRecord = ImmutableRecord({
  category: '',
  shortcode: '',
  static_url: '',
  url: '',
  visible_in_picker: true,
});

export const normalizeEmoji = (emoji: Record<string, any>) => {
  return EmojiRecord(
    ImmutableMap(fromJS(emoji)),
  );
};

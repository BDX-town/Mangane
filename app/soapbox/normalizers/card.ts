/**
 * Card normalizer:
 * Converts API cards into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/card/}
 */
import { Record as ImmutableRecord, Map as ImmutableMap } from 'immutable';

// https://docs.joinmastodon.org/entities/card/
export const CardRecord = ImmutableRecord({
  author_name: '',
  author_url: '',
  blurhash: null,
  description: '',
  embed_url: '',
  height: 0,
  html: '',
  image: null,
  provider_name: '',
  provider_url: '',
  title: '',
  type: 'link',
  url: '',
  width: 0,
});

export const normalizeCard = (card: ImmutableMap<string, any>) => {
  return CardRecord(card);
};

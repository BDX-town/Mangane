/**
 * Card normalizer:
 * Converts API cards into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/card/}
 */
import punycode from 'punycode';

import { Record as ImmutableRecord, Map as ImmutableMap, fromJS } from 'immutable';

import { mergeDefined } from 'soapbox/utils/normalizers';

// https://docs.joinmastodon.org/entities/card/
export const CardRecord = ImmutableRecord({
  author_name: '',
  author_url: '',
  blurhash: null as string | null,
  description: '',
  embed_url: '',
  height: 0,
  html: '',
  image: null as string | null,
  provider_name: '',
  provider_url: '',
  title: '',
  type: 'link',
  url: '',
  width: 0,
});

const IDNA_PREFIX = 'xn--';

const decodeIDNA = (domain: string): string => {
  return domain
    .split('.')
    .map(part => part.indexOf(IDNA_PREFIX) === 0 ? punycode.decode(part.slice(IDNA_PREFIX.length)) : part)
    .join('.');
};

const getHostname = (url: string): string => {
  const parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
};

/** Fall back to Pleroma's OG data */
const normalizePleromaOpengraph = (card: ImmutableMap<string, any>) => {
  const opengraph = ImmutableMap({
    width:  card.getIn(['pleroma', 'opengraph', 'width']),
    height: card.getIn(['pleroma', 'opengraph', 'height']),
    html:   card.getIn(['pleroma', 'opengraph', 'html']),
    image:  card.getIn(['pleroma', 'opengraph', 'thumbnail_url']),
  });

  return card.mergeWith(mergeDefined, opengraph);
};

/** Set provider from URL if not found */
const normalizeProviderName = (card: ImmutableMap<string, any>) => {
  const providerName = card.get('provider_name') || decodeIDNA(getHostname(card.get('url')));
  return card.set('provider_name', providerName);
};

export const normalizeCard = (card: Record<string, any>) => {
  return CardRecord(
    ImmutableMap(fromJS(card)).withMutations(card => {
      normalizePleromaOpengraph(card);
      normalizeProviderName(card);
    }),
  );
};

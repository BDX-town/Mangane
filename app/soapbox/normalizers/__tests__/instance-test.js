import { Map as ImmutableMap, fromJS } from 'immutable';

import { normalizeInstance } from '../instance';

describe('normalizeInstance()', () => {
  it('normalizes an empty Map', () => {
    const expected = ImmutableMap({
      description_limit: 1500,
      configuration: ImmutableMap({
        statuses: ImmutableMap({
          max_characters: 500,
          max_media_attachments: 4,
        }),
        polls: ImmutableMap({
          max_options: 4,
          max_characters_per_option: 25,
          min_expiration: 300,
          max_expiration: 2629746,
        }),
      }),
      version: '0.0.0',
    });

    const result = normalizeInstance(ImmutableMap());
    expect(result).toEqual(expected);
  });

  it('normalizes Pleroma instance with Mastodon configuration format', () => {
    const instance = fromJS(require('soapbox/__fixtures__/pleroma-instance.json'));

    const expected = {
      configuration: {
        statuses: {
          max_characters: 5000,
          max_media_attachments: Infinity,
        },
        polls: {
          max_options: 20,
          max_characters_per_option: 200,
          min_expiration: 0,
          max_expiration: 31536000,
        },
      },
    };

    const result = normalizeInstance(instance);
    expect(result.toJS()).toMatchObject(expected);
  });

  it('normalizes Mastodon instance with retained configuration', () => {
    const instance = fromJS(require('soapbox/__fixtures__/mastodon-instance.json'));

    const expected = {
      configuration: {
        statuses: {
          max_characters: 500,
          max_media_attachments: 4,
          characters_reserved_per_url: 23,
        },
        media_attachments: {
          image_size_limit: 10485760,
          image_matrix_limit: 16777216,
          video_size_limit: 41943040,
          video_frame_rate_limit: 60,
          video_matrix_limit: 2304000,
        },
        polls: {
          max_options: 4,
          max_characters_per_option: 50,
          min_expiration: 300,
          max_expiration: 2629746,
        },
      },
    };

    const result = normalizeInstance(instance);
    expect(result.toJS()).toMatchObject(expected);
  });

  it('normalizes Mastodon 3.0.0 instance with default configuration', () => {
    const instance = fromJS(require('soapbox/__fixtures__/mastodon-3.0.0-instance.json'));

    const expected = {
      configuration: {
        statuses: {
          max_characters: 500,
          max_media_attachments: 4,
        },
        polls: {
          max_options: 4,
          max_characters_per_option: 25,
          min_expiration: 300,
          max_expiration: 2629746,
        },
      },
    };

    const result = normalizeInstance(instance);
    expect(result.toJS()).toMatchObject(expected);
  });

  it('normalizes Fedibird instance', () => {
    const instance = fromJS(require('soapbox/__fixtures__/fedibird-instance.json'));
    const result = normalizeInstance(instance);

    // Sets description_limit
    expect(result.get('description_limit')).toEqual(1500);

    // But otherwise, it's the same
    expect(result.delete('description_limit')).toEqual(instance);
  });

  it('normalizes Mitra instance', () => {
    const instance = fromJS(require('soapbox/__fixtures__/mitra-instance.json'));
    const result = normalizeInstance(instance);

    // Adds configuration and description_limit
    expect(result.get('configuration') instanceof ImmutableMap).toBe(true);
    expect(result.get('description_limit')).toBe(1500);
  });
});

import { Map as ImmutableMap, fromJS } from 'immutable';

import { normalizeInstance } from '../instance';

describe('normalizeInstance()', () => {
  it('normalizes an empty Map', () => {
    const expected = {
      approval_required: false,
      contact_account: {},
      configuration: {
        media_attachments: {},
        polls: {
          max_options: 4,
          max_characters_per_option: 25,
          min_expiration: 300,
          max_expiration: 2629746,
        },
        statuses: {
          max_characters: 500,
          max_media_attachments: 4,
        },
      },
      description: '',
      description_limit: 1500,
      email: '',
      feature_quote: false,
      fedibird_capabilities: [],
      invites_enabled: false,
      languages: [],
      pleroma: {
        metadata: {
          account_activation_required: false,
          birthday_min_age: 0,
          birthday_required: false,
          features: [],
          federation: {
            enabled: true,
            exclusions: false,
          },
        },
        stats: {},
      },
      registrations: false,
      rules: [],
      short_description: '',
      stats: {
        domain_count: 0,
        status_count: 0,
        user_count: 0,
      },
      title: '',
      thumbnail: '',
      uri: '',
      urls: {},
      version: '0.0.0',
    };

    const result = normalizeInstance(ImmutableMap());
    expect(result.toJS()).toEqual(expected);
  });

  it('normalizes Pleroma instance with Mastodon configuration format', () => {
    const instance = require('soapbox/__fixtures__/pleroma-instance.json');

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
    const instance = require('soapbox/__fixtures__/mastodon-instance.json');

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
    const instance = require('soapbox/__fixtures__/mastodon-3.0.0-instance.json');

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
    const instance = require('soapbox/__fixtures__/fedibird-instance.json');
    const result = normalizeInstance(instance);

    // Sets description_limit
    expect(result.description_limit).toEqual(1500);

    // Preserves fedibird_capabilities
    expect(result.fedibird_capabilities).toEqual(fromJS(instance.fedibird_capabilities));
  });

  it('normalizes Mitra instance', () => {
    const instance = require('soapbox/__fixtures__/mitra-instance.json');
    const result = normalizeInstance(instance);

    // Adds configuration and description_limit
    expect(result.get('configuration') instanceof ImmutableMap).toBe(true);
    expect(result.get('description_limit')).toBe(1500);
  });

  it('normalizes GoToSocial instance', () => {
    const instance = require('soapbox/__fixtures__/gotosocial-instance.json');
    const result = normalizeInstance(instance);

    // Normalizes max_toot_chars
    expect(result.getIn(['configuration', 'statuses', 'max_characters'])).toEqual(5000);
    expect(result.has('max_toot_chars')).toBe(false);

    // Adds configuration and description_limit
    expect(result.get('configuration') instanceof ImmutableMap).toBe(true);
    expect(result.get('description_limit')).toBe(1500);
  });

  it('normalizes Friendica instance', () => {
    const instance = require('soapbox/__fixtures__/friendica-instance.json');
    const result = normalizeInstance(instance);

    // Normalizes max_toot_chars
    expect(result.getIn(['configuration', 'statuses', 'max_characters'])).toEqual(200000);
    expect(result.has('max_toot_chars')).toBe(false);

    // Adds configuration and description_limit
    expect(result.get('configuration') instanceof ImmutableMap).toBe(true);
    expect(result.get('description_limit')).toBe(1500);
  });

  it('normalizes a Mastodon RC version', () => {
    const instance = require('soapbox/__fixtures__/mastodon-instance-rc.json');
    const result = normalizeInstance(instance);

    expect(result.version).toEqual('3.5.0-rc1');
  });

  it('normalizes Pixelfed instance', () => {
    const instance = require('soapbox/__fixtures__/pixelfed-instance.json');
    const result = normalizeInstance(instance);
    expect(result.title).toBe('pixelfed');
  });
});

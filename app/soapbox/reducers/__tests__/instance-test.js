import { Map as ImmutableMap } from 'immutable';

import { INSTANCE_REMEMBER_SUCCESS } from 'soapbox/actions/instance';

import reducer from '../instance';

describe('instance reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
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
    }));
  });

  describe('INSTANCE_REMEMBER_SUCCESS', () => {
    it('normalizes Pleroma instance with Mastodon configuration format', () => {
      const action = {
        type: INSTANCE_REMEMBER_SUCCESS,
        instance: require('soapbox/__fixtures__/pleroma-instance.json'),
      };

      const result = reducer(undefined, action);

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

      expect(result.toJS()).toMatchObject(expected);
    });

    it('normalizes Mastodon instance with retained configuration', () => {
      const action = {
        type: INSTANCE_REMEMBER_SUCCESS,
        instance: require('soapbox/__fixtures__/mastodon-instance.json'),
      };

      const result = reducer(undefined, action);

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

      expect(result.toJS()).toMatchObject(expected);
    });

    it('normalizes Mastodon 3.0.0 instance with default configuration', () => {
      const action = {
        type: INSTANCE_REMEMBER_SUCCESS,
        instance: require('soapbox/__fixtures__/mastodon-3.0.0-instance.json'),
      };

      const result = reducer(undefined, action);

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

      expect(result.toJS()).toMatchObject(expected);
    });
  });
});

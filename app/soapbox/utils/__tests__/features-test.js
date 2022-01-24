import { Map as ImmutableMap } from 'immutable';

import {
  parseVersion,
  getFeatures,
} from '../features';

describe('parseVersion', () => {
  it('with Pleroma version string', () => {
    const version = '2.7.2 (compatible; Pleroma 2.0.5-6-ga36eb5ea-plerasstodon+dev)';
    expect(parseVersion(version)).toEqual({
      software: 'Pleroma',
      version: '2.0.5-6-ga36eb5ea-plerasstodon+dev',
      compatVersion: '2.7.2',
    });
  });

  it('with Mastodon version string', () => {
    const version = '3.0.0';
    expect(parseVersion(version)).toEqual({
      software: 'Mastodon',
      version: '3.0.0',
      compatVersion: '3.0.0',
    });
  });
});

describe('getFeatures', () => {
  describe('emojiReacts', () => {
    it('is true for Pleroma 2.0+', () => {
      const instance = ImmutableMap({
        version: '2.7.2 (compatible; Pleroma 2.0.5-6-ga36eb5ea-plerasstodon+dev)',
      });
      const features = getFeatures(instance);
      expect(features.emojiReacts).toBe(true);
    });

    it('is false for Pleroma < 2.0', () => {
      const instance = ImmutableMap({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.emojiReacts).toBe(false);
    });

    it('is false for Mastodon', () => {
      const instance = ImmutableMap({ version: '3.1.4' });
      const features = getFeatures(instance);
      expect(features.emojiReacts).toBe(false);
    });
  });

  describe('suggestions', () => {
    it('is true for Mastodon 2.4.3+', () => {
      const instance = ImmutableMap({ version: '2.4.3' });
      const features = getFeatures(instance);
      expect(features.suggestions).toBe(true);
    });

    it('is false for Mastodon < 2.4.3', () => {
      const instance = ImmutableMap({ version: '2.4.2' });
      const features = getFeatures(instance);
      expect(features.suggestions).toBe(false);
    });

    it('is false for Pleroma', () => {
      const instance = ImmutableMap({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.suggestions).toBe(false);
    });
  });

  describe('trends', () => {
    it('is true for Mastodon 3.0.0+', () => {
      const instance = ImmutableMap({ version: '3.0.0' });
      const features = getFeatures(instance);
      expect(features.trends).toBe(true);
    });

    it('is false for Mastodon < 3.0.0', () => {
      const instance = ImmutableMap({ version: '2.4.3' });
      const features = getFeatures(instance);
      expect(features.trends).toBe(false);
    });

    it('is false for Pleroma', () => {
      const instance = ImmutableMap({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.trends).toBe(false);
    });
  });

  describe('attachmentLimit', () => {
    it('is 4 by default', () => {
      const instance = ImmutableMap({ version: '3.1.4' });
      const features = getFeatures(instance);
      expect(features.attachmentLimit).toEqual(4);
    });

    it('is Infinity for Pleroma', () => {
      const instance = ImmutableMap({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.attachmentLimit).toEqual(Infinity);
    });
  });

  describe('focalPoint', () => {
    it('is true for Mastodon 2.3.0+', () => {
      const instance = ImmutableMap({ version: '2.3.0' });
      const features = getFeatures(instance);
      expect(features.focalPoint).toBe(true);
    });

    it('is false for Pleroma', () => {
      const instance = ImmutableMap({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.focalPoint).toBe(false);
    });
  });
});

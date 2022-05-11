import { InstanceRecord } from 'soapbox/normalizers';

import {
  parseVersion,
  getFeatures,
} from '../features';

describe('parseVersion', () => {
  it('with Pleroma version string', () => {
    const version = '2.7.2 (compatible; Pleroma 2.0.5-6-ga36eb5ea-plerasstodon+dev)';
    expect(parseVersion(version)).toEqual({
      software: 'Pleroma',
      version: '2.0.5-6-ga36eb5ea-plerasstodon',
      compatVersion: '2.7.2',
      build: 'dev',
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

  it('with a Pixelfed version string', () => {
    const version = '2.7.2 (compatible; Pixelfed 0.11.2)';
    expect(parseVersion(version)).toEqual({
      software: 'Pixelfed',
      version: '0.11.2',
      compatVersion: '2.7.2',
    });
  });

  it('with a Truth Social version string', () => {
    const version = '3.4.1 (compatible; TruthSocial 1.0.0)';
    expect(parseVersion(version)).toEqual({
      software: 'TruthSocial',
      version: '1.0.0',
      compatVersion: '3.4.1',
    });
  });

  it('with a Mastodon fork', () => {
    const version = '3.5.1+glitch';
    expect(parseVersion(version)).toEqual({
      software: 'Mastodon',
      version: '3.5.1',
      compatVersion: '3.5.1',
      build: 'glitch',
    });
  });

  it('with a Pleroma fork', () => {
    const version = '2.7.2 (compatible; Pleroma 2.4.2+cofe)';
    expect(parseVersion(version)).toEqual({
      software: 'Pleroma',
      version: '2.4.2',
      compatVersion: '2.7.2',
      build: 'cofe',
    });
  });
});

describe('getFeatures', () => {
  describe('emojiReacts', () => {
    it('is true for Pleroma 2.0+', () => {
      const instance = InstanceRecord({
        version: '2.7.2 (compatible; Pleroma 2.0.5-6-ga36eb5ea-plerasstodon+dev)',
      });
      const features = getFeatures(instance);
      expect(features.emojiReacts).toBe(true);
    });

    it('is false for Pleroma < 2.0', () => {
      const instance = InstanceRecord({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.emojiReacts).toBe(false);
    });

    it('is false for Mastodon', () => {
      const instance = InstanceRecord({ version: '3.1.4' });
      const features = getFeatures(instance);
      expect(features.emojiReacts).toBe(false);
    });
  });

  describe('suggestions', () => {
    it('is true for Mastodon 2.4.3+', () => {
      const instance = InstanceRecord({ version: '2.4.3' });
      const features = getFeatures(instance);
      expect(features.suggestions).toBe(true);
    });

    it('is false for Mastodon < 2.4.3', () => {
      const instance = InstanceRecord({ version: '2.4.2' });
      const features = getFeatures(instance);
      expect(features.suggestions).toBe(false);
    });

    it('is false for Pleroma', () => {
      const instance = InstanceRecord({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.suggestions).toBe(false);
    });
  });

  describe('trends', () => {
    it('is true for Mastodon 3.0.0+', () => {
      const instance = InstanceRecord({ version: '3.0.0' });
      const features = getFeatures(instance);
      expect(features.trends).toBe(true);
    });

    it('is false for Mastodon < 3.0.0', () => {
      const instance = InstanceRecord({ version: '2.4.3' });
      const features = getFeatures(instance);
      expect(features.trends).toBe(false);
    });

    it('is false for Pleroma', () => {
      const instance = InstanceRecord({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.trends).toBe(false);
    });
  });

  describe('focalPoint', () => {
    it('is true for Mastodon 2.3.0+', () => {
      const instance = InstanceRecord({ version: '2.3.0' });
      const features = getFeatures(instance);
      expect(features.focalPoint).toBe(true);
    });

    it('is false for Pleroma', () => {
      const instance = InstanceRecord({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      const features = getFeatures(instance);
      expect(features.focalPoint).toBe(false);
    });
  });
});

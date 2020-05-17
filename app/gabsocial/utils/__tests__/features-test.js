import {
  parseVersion,
  getFeatures,
} from '../features';
import { fromJS } from 'immutable';

describe('parseVersion', () => {
  it('with Pleroma version string', () => {
    let version = '2.7.2 (compatible; Pleroma 2.0.5-6-ga36eb5ea-plerasstodon+dev)';
    expect(parseVersion(version)).toEqual({
      software: 'Pleroma',
      version: '2.0.5-6-ga36eb5ea-plerasstodon+dev',
      compatVersion: '2.7.2',
    });
  });

  it('with Mastodon version string', () => {
    let version = '3.0.0';
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
      let instance = fromJS({
        version: '2.7.2 (compatible; Pleroma 2.0.5-6-ga36eb5ea-plerasstodon+dev)',
      });
      let features = getFeatures(instance);
      expect(features.emojiReacts).toBe(true);
    });

    it('is false for Pleroma < 2.0', () => {
      let instance = fromJS({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      let features = getFeatures(instance);
      expect(features.emojiReacts).toBe(false);
    });

    it('is false for Mastodon', () => {
      let instance = fromJS({ version: '3.1.4' });
      let features = getFeatures(instance);
      expect(features.emojiReacts).toBe(false);
    });
  });

  describe('suggestions', () => {
    it('is true for Mastodon 2.4.3+', () => {
      let instance = fromJS({ version: '2.4.3' });
      let features = getFeatures(instance);
      expect(features.suggestions).toBe(true);
    });

    it('is false for Mastodon < 2.4.3', () => {
      let instance = fromJS({ version: '2.4.2' });
      let features = getFeatures(instance);
      expect(features.suggestions).toBe(false);
    });

    it('is false for Pleroma', () => {
      let instance = fromJS({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      let features = getFeatures(instance);
      expect(features.suggestions).toBe(false);
    });
  });

  describe('trends', () => {
    it('is true for Mastodon 3.0.0+', () => {
      let instance = fromJS({ version: '3.0.0' });
      let features = getFeatures(instance);
      expect(features.trends).toBe(true);
    });

    it('is false for Mastodon < 3.0.0', () => {
      let instance = fromJS({ version: '2.4.3' });
      let features = getFeatures(instance);
      expect(features.trends).toBe(false);
    });

    it('is false for Pleroma', () => {
      let instance = fromJS({
        version: '2.7.2 (compatible; Pleroma 1.1.50-42-g3d9ac6ae-develop)',
      });
      let features = getFeatures(instance);
      expect(features.trends).toBe(false);
    });
  });
});

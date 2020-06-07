// Detect backend features to conditionally render elements
import semver from 'semver';

export const getFeatures = instance => {
  const v = parseVersion(instance.get('version'));
  return {
    suggestions: v.software === 'Mastodon' && semver.gte(v.compatVersion, '2.4.3'),
    trends: v.software === 'Mastodon' && semver.gte(v.compatVersion, '3.0.0'),
    emojiReacts: v.software === 'Pleroma' && semver.gte(v.version, '2.0.0'),
    attachmentLimit: v.software === 'Pleroma' ? Infinity : 4,
    focalPoint: v.software === 'Mastodon' && semver.gte(v.compatVersion, '2.3.0'),
  };
};

export const parseVersion = version => {
  let regex = /^([\w\.]*)(?: \(compatible; ([\w]*) (.*)\))?$/;
  let match = regex.exec(version);
  return {
    software: match[2] || 'Mastodon',
    version: match[3] || match[1],
    compatVersion: match[1],
  };
};

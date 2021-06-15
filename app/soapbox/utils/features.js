// Detect backend features to conditionally render elements
import gte from 'semver/functions/gte';
import { List as ImmutableList } from 'immutable';

export const getFeatures = instance => {
  const v = parseVersion(instance.get('version'));
  const f = instance.getIn(['pleroma', 'metadata', 'features'], ImmutableList());
  return {
    suggestions: v.software === 'Mastodon' && gte(v.compatVersion, '2.4.3'),
    trends: v.software === 'Mastodon' && gte(v.compatVersion, '3.0.0'),
    emojiReacts: v.software === 'Pleroma' && gte(v.version, '2.0.0'),
    emojiReactsRGI: v.software === 'Pleroma' && gte(v.version, '2.2.49'),
    attachmentLimit: v.software === 'Pleroma' ? Infinity : 4,
    focalPoint: v.software === 'Mastodon' && gte(v.compatVersion, '2.3.0'),
    importMutes: v.software === 'Pleroma' && gte(v.version, '2.2.0'),
    emailList: f.includes('email_list'),
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

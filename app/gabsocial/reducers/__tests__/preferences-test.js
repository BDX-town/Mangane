import { mastoPrefsToMap } from '../preferences';
import { Map as ImmutableMap } from 'immutable';

describe('mastoPrefToMap', () => {
  const prefs = {
    'posting:default:visibility': 'public',
    'posting:default:sensitive': false,
    'posting:default:language': null,
    'reading:expand:media': 'default',
    'reading:expand:spoilers': false,
  };
  it('returns a map', () => {
    expect(mastoPrefsToMap(prefs)).toEqual(ImmutableMap({
      posting: ImmutableMap({
        default: ImmutableMap({
          visibility: 'public',
          sensitive: false,
          language: null,
        }),
      }),
      reading: ImmutableMap({
        expand: ImmutableMap({
          media: 'default',
          spoilers: false,
        }),
      }),
    }));
  });
});

import reducer from '../media_attachments';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('media_attachments reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      accept_content_types: ImmutableList([
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.webm',
        '.mp4',
        '.m4v',
        '.mov',
        '.mp3',
        '.ogg',
        '.wav',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/webm',
        'video/mp4',
        'video/quicktime',
        'audio/mp3',
        'audio/mpeg',
        'audio/ogg',
        'audio/wav',
      ]),
    }));
  });
});

import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';

const initialState = ImmutableMap({
  // FIXME: Leave this empty and pull from backend
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
});

export default function meta(state = initialState, action) {
  switch(action.type) {
  default:
    return state;
  }
}

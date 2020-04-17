import { STORE_HYDRATE } from '../actions/store';
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
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/webm',
    'video/mp4',
    'video/quicktime',
  ]),
});

export default function meta(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return state.merge(action.state.get('media_attachments'));
  default:
    return state;
  }
};

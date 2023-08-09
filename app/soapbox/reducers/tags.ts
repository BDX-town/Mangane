import { List as ImmutableList } from 'immutable';

import { TAG_FETCH_SUCCESS, TAG_FOLLOW_SUCCESS, TAG_UNFOLLOW_SUCCESS } from 'soapbox/actions/tags';
import { normalizeTag } from 'soapbox/normalizers';

import type { AnyAction } from 'redux';
import type { APIEntity, Tag } from 'soapbox/types/entities';

type State = ImmutableList<Tag>;

const importTags = (_state: State, tags: APIEntity[]): State => {
  return ImmutableList(tags.map((tag) => normalizeTag(tag)));
};

const addTag = (state: State, tag: APIEntity): State => {
  return state.push(normalizeTag(tag));
};

const removeTag = (state: State, _tag: APIEntity): State => {
  const tag = normalizeTag(_tag);
  return state.filter((t) => t.name !== tag.name);
};

export default function filters(state: State = ImmutableList<Tag>(), action: AnyAction): State {
  switch (action.type) {
    case TAG_FETCH_SUCCESS:
      return importTags(state, action.tags);
    case TAG_FOLLOW_SUCCESS:
      return addTag(state, action.tag);
    case TAG_UNFOLLOW_SUCCESS:
      return removeTag(state, action.tag);
    default:
      return state;
  }
}

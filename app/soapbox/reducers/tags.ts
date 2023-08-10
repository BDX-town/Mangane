import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import { TAG_FETCH_FAIL, TAG_FETCH_REQUEST, TAG_FETCH_SUCCESS, TAG_FOLLOW_FAIL, TAG_FOLLOW_REQUEST, TAG_FOLLOW_SUCCESS, TAG_UNFOLLOW_FAIL, TAG_UNFOLLOW_REQUEST, TAG_UNFOLLOW_SUCCESS } from 'soapbox/actions/tags';
import { normalizeTag } from 'soapbox/normalizers';

import type { AnyAction } from 'redux';
import type { APIEntity, Tag } from 'soapbox/types/entities';

const TagRecord = ImmutableRecord({
  list: ImmutableList<Tag>(),
  loading: true,
});

type State = ReturnType<typeof TagRecord>;

const importTags = (state: State, tags: APIEntity[]): State => {
  return state.withMutations((s) => {
    s.set('list', ImmutableList(tags.map((tag) => normalizeTag(tag))));
    s.set('loading', false);
  });
};

const addTag = (state: State, tag: APIEntity): State => {
  return state.withMutations((s) => {
    s.set('list', state.list.push(normalizeTag(tag)));
    s.set('loading', false);
  });
};

const removeTag = (state: State, _tag: APIEntity): State => {
  const tag = normalizeTag(_tag);
  return state.withMutations((s) => {
    s.set('list', state.list.filter((t) => t.name !== tag.name));
    s.set('loading', false);
  });
};

export default function filters(state = TagRecord(), action: AnyAction): State {
  switch (action.type) {
    case TAG_FETCH_REQUEST:
    case TAG_FOLLOW_REQUEST:
    case TAG_UNFOLLOW_REQUEST:
      return state.set('loading', true);
    case TAG_FETCH_SUCCESS:
      return importTags(state, action.tags);
    case TAG_FOLLOW_SUCCESS:
      return addTag(state, action.tag);
    case TAG_UNFOLLOW_SUCCESS:
      return removeTag(state, action.tag);
    case TAG_FETCH_FAIL:
    case TAG_FOLLOW_FAIL:
    case TAG_UNFOLLOW_FAIL:
      return state.set('loading', false);
    default:
      return state;
  }
}

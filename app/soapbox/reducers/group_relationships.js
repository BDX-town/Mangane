import { GROUP_RELATIONSHIPS_FETCH_SUCCESS, GROUP_JOIN_SUCCESS, GROUP_LEAVE_SUCCESS } from '../actions/groups';
import { Map as ImmutableMap, fromJS } from 'immutable';

const normalizeRelationship = (state, relationship) => state.set(relationship.id, fromJS(relationship));

const normalizeRelationships = (state, relationships) => {
  relationships.forEach(relationship => {
    state = normalizeRelationship(state, relationship);
  });

  return state;
};

const initialState = ImmutableMap();

export default function group_relationships(state = initialState, action) {
  switch(action.type) {
  case GROUP_JOIN_SUCCESS:
  case GROUP_LEAVE_SUCCESS:
    return normalizeRelationship(state, action.relationship);
  case GROUP_RELATIONSHIPS_FETCH_SUCCESS:
    return normalizeRelationships(state, action.relationships);
  default:
    return state;
  }
}

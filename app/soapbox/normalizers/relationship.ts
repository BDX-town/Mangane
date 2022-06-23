/**
 * Relationship normalizer:
 * Converts API relationships into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/relationship/}
 */
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

// https://docs.joinmastodon.org/entities/relationship/
// https://api.pleroma.social/#operation/AccountController.relationships
export const RelationshipRecord = ImmutableRecord({
  blocked_by: false,
  blocking: false,
  domain_blocking: false,
  endorsed: false,
  followed_by: false,
  following: false,
  id: '',
  muting: false,
  muting_notifications: false,
  note: '',
  notifying: false,
  requested: false,
  showing_reblogs: false,
  subscribing: false,
});

export const normalizeRelationship = (relationship: Record<string, any>) => {
  return RelationshipRecord(
    ImmutableMap(fromJS(relationship)),
  );
};

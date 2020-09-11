export const PROFILE_HOVER_CARD_OPEN = 'PROFILE_HOVER_CARD_OPEN';

export function openProfileHoverCard(ref, accountId) {
  return {
    type: PROFILE_HOVER_CARD_OPEN,
    ref,
    accountId,
  };
}

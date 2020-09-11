export const PROFILE_HOVER_CARD_OPEN = 'PROFILE_HOVER_CARD_OPEN';
export const PROFILE_HOVER_CARD_CLEAR = 'PROFILE_HOVER_CARD_CLEAR';

export function openProfileHoverCard(ref, accountId) {
  return {
    type: PROFILE_HOVER_CARD_OPEN,
    ref,
    accountId,
  };
}

export function clearProfileHoverCard() {
  return {
    type: PROFILE_HOVER_CARD_CLEAR,
  };
}

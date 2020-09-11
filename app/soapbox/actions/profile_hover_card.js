export const PROFILE_HOVER_CARD_OPEN = 'PROFILE_HOVER_CARD_OPEN';
export const PROFILE_HOVER_CARD_UPDATE = 'PROFILE_HOVER_CARD_UPDATE';
export const PROFILE_HOVER_CARD_CLOSE = 'PROFILE_HOVER_CARD_CLOSE';

export function openProfileHoverCard(ref, accountId) {
  return {
    type: PROFILE_HOVER_CARD_OPEN,
    ref,
    accountId,
  };
}

export function updateProfileHoverCard() {
  return {
    type: PROFILE_HOVER_CARD_UPDATE,
  };
}

export function closeProfileHoverCard(force = false) {
  return {
    type: PROFILE_HOVER_CARD_CLOSE,
    force,
  };
}

export const STATUS_HOVER_CARD_OPEN = 'STATUS_HOVER_CARD_OPEN';
export const STATUS_HOVER_CARD_UPDATE = 'STATUS_HOVER_CARD_UPDATE';
export const STATUS_HOVER_CARD_CLOSE = 'STATUS_HOVER_CARD_CLOSE';

export function openStatusHoverCard(ref, statusId) {
  return {
    type: STATUS_HOVER_CARD_OPEN,
    ref,
    statusId,
  };
}

export function updateStatusHoverCard() {
  return {
    type: STATUS_HOVER_CARD_UPDATE,
  };
}

export function closeStatusHoverCard(force = false) {
  return {
    type: STATUS_HOVER_CARD_CLOSE,
    force,
  };
}

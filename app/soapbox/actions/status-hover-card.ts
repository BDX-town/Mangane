const STATUS_HOVER_CARD_OPEN = 'STATUS_HOVER_CARD_OPEN';
const STATUS_HOVER_CARD_UPDATE = 'STATUS_HOVER_CARD_UPDATE';
const STATUS_HOVER_CARD_CLOSE = 'STATUS_HOVER_CARD_CLOSE';

const openStatusHoverCard = (ref: React.MutableRefObject<HTMLDivElement>, statusId: string) => ({
  type: STATUS_HOVER_CARD_OPEN,
  ref,
  statusId,
});

const updateStatusHoverCard = () => ({
  type: STATUS_HOVER_CARD_UPDATE,
});

const closeStatusHoverCard = (force = false) => ({
  type: STATUS_HOVER_CARD_CLOSE,
  force,
});

export {
  STATUS_HOVER_CARD_OPEN,
  STATUS_HOVER_CARD_UPDATE,
  STATUS_HOVER_CARD_CLOSE,
  openStatusHoverCard,
  updateStatusHoverCard,
  closeStatusHoverCard,
};

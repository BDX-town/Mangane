const PROFILE_HOVER_CARD_OPEN = 'PROFILE_HOVER_CARD_OPEN';
const PROFILE_HOVER_CARD_UPDATE = 'PROFILE_HOVER_CARD_UPDATE';
const PROFILE_HOVER_CARD_CLOSE = 'PROFILE_HOVER_CARD_CLOSE';

const openProfileHoverCard = (ref: React.MutableRefObject<HTMLDivElement>, accountId: string) => ({
  type: PROFILE_HOVER_CARD_OPEN,
  ref,
  accountId,
});

const updateProfileHoverCard = () => ({
  type: PROFILE_HOVER_CARD_UPDATE,
});

const closeProfileHoverCard = (force = false) => ({
  type: PROFILE_HOVER_CARD_CLOSE,
  force,
});

export {
  PROFILE_HOVER_CARD_OPEN,
  PROFILE_HOVER_CARD_UPDATE,
  PROFILE_HOVER_CARD_CLOSE,
  openProfileHoverCard,
  updateProfileHoverCard,
  closeProfileHoverCard,
};

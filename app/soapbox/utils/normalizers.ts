/** Use new value only if old value is undefined */
export const mergeDefined = (oldVal: any, newVal: any) => oldVal === undefined ? newVal : oldVal;

export const makeEmojiMap = (emojis: any) => emojis.reduce((obj: any, emoji: any) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

/** Normalize entity ID */
export const normalizeId = (id: any): string | null => {
  return typeof id === 'string' ? id : null;
};

// Returns `true` if the node contains only emojis, up to a limit
export const onlyEmoji = (node, limit = 1) => {
  if (!node) return false;
  if (node.textContent.replaceAll(' ', '') !== '') return false;
  const emojis = [...node.querySelectorAll('img.emojione')];
  if (emojis.length === 0) return false;
  if (emojis.length > limit) return false;
  const images = [...node.querySelectorAll('img')];
  if (images.length > emojis.length) return false;
  return true;
};

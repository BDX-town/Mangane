// Returns `true` if the node contains only emojis, up to a limit
export const onlyEmoji = (node, limit = 1, ignoreMentions = true) => {
  if (!node) return false;

  try {
    // Remove mentions before checking content
    if (ignoreMentions) {
      node = node.cloneNode(true);
      node.querySelectorAll('a.mention').forEach(m => m.parentNode.removeChild(m));
    }

    if (node.textContent.replaceAll(' ', '') !== '') return false;
    const emojis = Array.from(node.querySelectorAll('img.emojione'));
    if (emojis.length === 0) return false;
    if (emojis.length > limit) return false;
    const images = Array.from(node.querySelectorAll('img'));
    if (images.length > emojis.length) return false;
    return true;
  } catch (e) {
    // Apparently some browsers can't handle `node.textContent.replaceAll`??
    // If anything in here crashes, skipping it is inconsequential.
    console.error(e);
    return false;
  }
};

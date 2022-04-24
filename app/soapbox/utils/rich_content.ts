/** Returns `true` if the node contains only emojis, up to a limit */
export const onlyEmoji = (node: HTMLElement, limit = 1, ignoreMentions = true): boolean => {
  if (!node) return false;

  try {
    // Remove mentions before checking content
    if (ignoreMentions) {
      node = node.cloneNode(true) as HTMLElement;
      node.querySelectorAll('a.mention').forEach(m => m.parentNode?.removeChild(m));
    }

    if (node.textContent?.replace(new RegExp(' ', 'g'), '') !== '') return false;
    const emojis = Array.from(node.querySelectorAll('img.emojione'));
    if (emojis.length === 0) return false;
    if (emojis.length > limit) return false;
    const images = Array.from(node.querySelectorAll('img'));
    if (images.length > emojis.length) return false;
    return true;
  } catch (e) {
    // If anything in here crashes, skipping it is inconsequential.
    console.error(e);
    return false;
  }
};

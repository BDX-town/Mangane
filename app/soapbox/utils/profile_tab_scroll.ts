let pending: number | null = null;

/** Nearest ancestor that actually scrolls (the layout scrolls inside its containers, not the window). */
const findScroller = (el: HTMLElement | null): HTMLElement => {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node;
    }
  }

  return (document.scrollingElement || document.documentElement) as HTMLElement;
};

/**
 * Remember where to scroll to after switching between the tabs of a profile:
 * keep the current position, but never go further than the top of the tabs.
 */
const rememberProfileTabScroll = (tabs: HTMLElement | null): void => {
  if (!tabs) return;

  const scroller = findScroller(tabs);
  const tabsTop = tabs.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
  pending = Math.min(scroller.scrollTop, tabsTop);
};

/**
 * Restore the position remembered by `rememberProfileTabScroll`. The new tab may still be loading
 * (and so too short to scroll that far), so keep trying for a few frames while its content grows.
 */
const restoreProfileTabScroll = (tabs: HTMLElement | null): void => {
  const y = pending;
  pending = null;

  if (y === null || !tabs) return;

  const scroller = findScroller(tabs);
  let frames = 0;

  const apply = () => {
    scroller.scrollTop = y;
    if (Math.abs(scroller.scrollTop - y) > 1 && ++frames < 60) {
      requestAnimationFrame(apply);
    }
  };

  apply();
};

export { rememberProfileTabScroll, restoreProfileTabScroll };

import { sanitizeUrl } from './url-policy';

let cleanupInstalledPolicy: (() => void) | null = null;

const enforceAnchorPolicy = (anchor: HTMLAnchorElement): boolean => {
  const rawHref = anchor.getAttribute('href');
  if (rawHref !== null && !sanitizeUrl(rawHref)) {
    anchor.removeAttribute('href');
    return false;
  }

  if (anchor.target === '_blank') {
    const required = ['nofollow', 'noopener', 'noreferrer'];
    const rel = new Set(anchor.rel.split(/\s+/).filter(Boolean));
    required.forEach(value => rel.add(value));
    const nextRel = [...rel].join(' ');
    if (anchor.rel !== nextRel) anchor.rel = nextRel;
  }

  return true;
};

const enforceNodePolicy = (node: Node): void => {
  if (!(node instanceof Element)) return;
  if (node instanceof HTMLAnchorElement) enforceAnchorPolicy(node);
  node.querySelectorAll('a').forEach(enforceAnchorPolicy);
};

/**
 * Enforce the central destination policy for native anchors, including legacy
 * JSX callsites and administrator-configured links. Event capture is the
 * synchronous fail-closed layer; the observer also removes unsafe hrefs before
 * context-menu and keyboard navigation.
 */
export const installNavigationPolicy = (): (() => void) => {
  if (cleanupInstalledPolicy) return cleanupInstalledPolicy;

  const guardNavigation = (event: Event): void => {
    const target = event.target;
    const anchor = target instanceof Element ? target.closest('a') : null;
    if (anchor instanceof HTMLAnchorElement && !enforceAnchorPolicy(anchor)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  document.addEventListener('click', guardNavigation, true);
  document.addEventListener('auxclick', guardNavigation, true);
  enforceNodePolicy(document.documentElement);

  const observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'attributes') {
        enforceNodePolicy(record.target);
      } else {
        record.addedNodes.forEach(enforceNodePolicy);
      }
    });
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['href', 'rel', 'target'],
    childList: true,
    subtree: true,
  });

  cleanupInstalledPolicy = () => {
    observer.disconnect();
    document.removeEventListener('click', guardNavigation, true);
    document.removeEventListener('auxclick', guardNavigation, true);
    cleanupInstalledPolicy = null;
  };

  return cleanupInstalledPolicy;
};

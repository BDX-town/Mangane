/**
 * Precheck: information about the site before anything renders.
 * @module soapbox/precheck
 */

const hasTitle = Boolean(document.querySelector('title'));

const hasPrerenderPleroma  = Boolean(document.getElementById('initial-results'));
const hasPrerenderMastodon = Boolean(document.getElementById('initial-state'));

export const isPrerendered = hasTitle || hasPrerenderPleroma || hasPrerenderMastodon;

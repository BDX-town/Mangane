/**
 * Precheck: information about the site before anything renders.
 * @module soapbox/precheck
 */

/** Whether a page title was inserted with SSR. */
const hasTitle = Boolean(document.querySelector('title'));

/** Whether pre-rendered data exists in Mastodon's format. */
const hasPrerenderPleroma  = Boolean(document.getElementById('initial-results'));

/** Whether pre-rendered data exists in Pleroma's format. */
const hasPrerenderMastodon = Boolean(document.getElementById('initial-state'));

/** Whether initial data was loaded into the page by server-side-rendering (SSR). */
export const isPrerendered = hasTitle || hasPrerenderPleroma || hasPrerenderMastodon;

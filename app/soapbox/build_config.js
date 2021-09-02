// @preval
/**
 * Build config: configuration set at build time.
 * @module soapbox/build_config
 */

const { trimEnd } = require('lodash');

const {
  BACKEND_URL,
  FE_BASE_PATH,
  CI_PAGES_URL,
} = process.env;

const sanitizeURL = url => {
  try {
    return new URL(url).toString();
  } catch {
    return '';
  }
};

// Run Soapbox FE from a subdirectory.
// If FE_BASE_PATH (eg '/web') is provided, prefer it.
// For GitLab Pages builds, CI_PAGES_URL will be used.
const getFeBasePath = () => {
  if (FE_BASE_PATH) {
    return trimEnd(FE_BASE_PATH, '/');
  } else if (CI_PAGES_URL) {
    try {
      const { pathname } = new URL(CI_PAGES_URL);
      return trimEnd(pathname, '/');
    } catch {
      return '/';
    }
  } else {
    return '/';
  }
};

// JSON.parse/stringify is to emulate what @preval is doing and avoid any
// inconsistent behavior in dev mode
const sanitize = obj => JSON.parse(JSON.stringify(obj));

module.exports = sanitize({
  BACKEND_URL: sanitizeURL(BACKEND_URL),
  FE_BASE_PATH: getFeBasePath(),
});

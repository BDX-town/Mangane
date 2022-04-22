// @preval
/**
 * Build config: configuration set at build time.
 * @module soapbox/build_config
 */

const { trim, trimEnd } = require('lodash');

const {
  NODE_ENV,
  BACKEND_URL,
  FE_SUBDIRECTORY,
  FE_BUILD_DIR,
  SENTRY_DSN,
} = process.env;

const sanitizeURL = url => {
  try {
    return trimEnd(new URL(url).toString(), '/');
  } catch {
    return '';
  }
};

const sanitizeBasename = path => {
  return `/${trim(path, '/')}`;
};

const sanitizePath = path => {
  return trim(path, '/');
};

// JSON.parse/stringify is to emulate what @preval is doing and avoid any
// inconsistent behavior in dev mode
const sanitize = obj => JSON.parse(JSON.stringify(obj));

module.exports = sanitize({
  NODE_ENV: NODE_ENV || 'development',
  BACKEND_URL: sanitizeURL(BACKEND_URL),
  FE_SUBDIRECTORY: sanitizeBasename(FE_SUBDIRECTORY),
  FE_BUILD_DIR: sanitizePath(FE_BUILD_DIR) || 'static',
  SENTRY_DSN,
});

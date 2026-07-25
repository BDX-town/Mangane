// @preval
/**
 * Build config: configuration set at build time.
 * @module soapbox/build_config
 */

const trim = require('lodash/trim');
const trimEnd = require('lodash/trimEnd');

const {
  NODE_ENV,
  BACKEND_URL,
  FE_SUBDIRECTORY,
  FE_BUILD_DIR,
  FE_INSTANCE_SOURCE_DIR,
} = process.env;

const sanitizeURL = url => {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return trimEnd(parsed.toString(), '/');
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
  FE_INSTANCE_SOURCE_DIR: FE_INSTANCE_SOURCE_DIR || 'instance',
});

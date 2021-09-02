// @preval
/**
 * Build config: configuration set at build time.
 * @module soapbox/build_config
 */

const { trim } = require('lodash');

const {
  BACKEND_URL,
  FE_BASE_PATH,
} = process.env;

const sanitizeURL = url => {
  try {
    return new URL(url).toString();
  } catch {
    return '';
  }
};

// Run Soapbox FE from a subdirectory.
const getFeBasePath = () => {
  return `/${trim(FE_BASE_PATH, '/')}`;
};

// JSON.parse/stringify is to emulate what @preval is doing and avoid any
// inconsistent behavior in dev mode
const sanitize = obj => JSON.parse(JSON.stringify(obj));

module.exports = sanitize({
  BACKEND_URL: sanitizeURL(BACKEND_URL),
  FE_BASE_PATH: getFeBasePath(),
});

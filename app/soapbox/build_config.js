// @preval
/**
 * Build config: configuration set at build time.
 * @module soapbox/build_config
 */

const { BACKEND_URL } = process.env;

const sanitizeURL = url => {
  try {
    return new URL(url).toString();
  } catch {
    return '';
  }
};

// JSON.parse/stringify is to emulate what @preval is doing and avoid any
// inconsistent behavior in dev mode
const sanitize = obj => JSON.parse(JSON.stringify(obj));

module.exports = sanitize({
  BACKEND_URL: sanitizeURL(BACKEND_URL),
});

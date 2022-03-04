/**
 * Functions for dealing with custom build configuration.
 */

/** Require a custom JSON file if it exists */
export const custom = (filename, fallback = {}) => {
  const context = require.context('custom', false, /\.json$/);
  const path = `./${filename}.json`;

  return context.keys().includes(path) ? context(path) : fallback;
};

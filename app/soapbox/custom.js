/**
 * Functions for dealing with custom build configuration.
 */
import { NODE_ENV } from 'soapbox/build_config';

/** Require a custom JSON file if it exists */
export const custom = (filename, fallback = {}) => {
  if (NODE_ENV === 'test') return fallback;

  const context = require.context('custom', false, /\.json$/);
  const path = `./${filename}.json`;

  return context.keys().includes(path) ? context(path) : fallback;
};

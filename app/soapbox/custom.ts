/**
 * Functions for dealing with custom build configuration.
 */
import * as BuildConfig from 'soapbox/build_config';

/** Require a custom JSON file if it exists */
export const custom = (filename: string, fallback: any = {}): any => {
  if (BuildConfig.NODE_ENV === 'test') return fallback;

  // @ts-ignore: yes it does
  const context = require.context('custom', false, /\.json$/);
  const path = `./${filename}.json`;

  return context.keys().includes(path) ? context(path) : fallback;
};

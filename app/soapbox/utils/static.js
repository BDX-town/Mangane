/**
 * Static: functions related to static files.
 * @module soapbox/utils/static
 */

import { join } from 'path';
import { FE_SUBDIRECTORY } from 'soapbox/build_config';

export const joinPublicPath = (...paths) => {
  return join(FE_SUBDIRECTORY, ...paths);
};

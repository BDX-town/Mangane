'use strict';

/**
 * Compare numerical primary keys represented as strings.
 * For example, '10' (as a string) is considered less than '9'
 * when sorted alphabetically. So compare string length first.
 *
 * - `0`: id1 == id2
 * - `1`: id1 > id2
 * - `-1`: id1 < id2
 */
export default function compareId(id1: string, id2: string) {
  if (id1 === id2) {
    return 0;
  }
  if (id1.length === id2.length) {
    return id1 > id2 ? 1 : -1;
  } else {
    return id1.length > id2.length ? 1 : -1;
  }
}

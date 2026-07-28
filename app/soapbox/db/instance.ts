/**
 * Phase 5 — Database singleton instance.
 *
 * The application uses exactly one Dexie database instance for its entire
 * lifetime. This module exports that singleton. All repository access goes
 * through this instance.
 *
 * The database name includes a version namespace to allow future schema
 * resets without conflicting with the legacy localForage store.
 */
import { ManganeDatabase } from './schema';

/**
 * The canonical local data store singleton.
 * Never import Dexie or ManganeDatabase directly in application code —
 * always use this instance through the repository layer.
 */
export const db = new ManganeDatabase('mangane-local-store');

export default db;

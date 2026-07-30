/**
 * Phase 8B-1 — Entity repository tests.
 *
 * Tests CRUD, alias indexing, merge chains, tombstones, provider lookups,
 * account-scoped purge, and IDOR prevention.
 */

import { generateEntityId, isValidEntityId } from 'soapbox/domain/entity-resolution';

import {
  addAlias,
  addProviderReference,
  createEntity,
  findEntitiesByLabel,
  findEntityByProvider,
  getAttributionsForResource,
  getDiagnostics,
  getEntity,
  getResolution,
  mergeEntities,
  purgeAccountData,
  resetAllStores,
  storeCreatorAttribution,
  storeResolution,
  tombstoneEntity,
} from '../entity-repository';

import type { CanonicalEntityId, EntityResolution, LinkCreatorAttribution } from 'soapbox/domain/entity-resolution';

beforeEach(() => {
  resetAllStores();
});

describe('createEntity', () => {
  it('creates an entity with a valid ID', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'Alice' });
    expect(isValidEntityId(id)).toBe(true);
    const entity = getEntity(id);
    expect(entity).toBeDefined();
    expect(entity!.kind).toBe('person');
    expect(entity!.preferredLabel).toBe('Alice');
    expect(entity!.state).toBe('active');
  });

  it('throws for empty label', () => {
    expect(() => createEntity({ kind: 'person', preferredLabel: '' })).toThrow();
  });

  it('bounds long labels', () => {
    const id = createEntity({ kind: 'topic', preferredLabel: 'x'.repeat(1000) });
    const entity = getEntity(id);
    expect(entity!.preferredLabel.length).toBeLessThanOrEqual(500);
  });

  it('validates URLs (rejects non-http)', () => {
    const id = createEntity({ kind: 'organization', preferredLabel: 'Org', homepageUrl: 'file:///etc/passwd' });
    const entity = getEntity(id);
    expect(entity!.homepageUrl).toBeUndefined();
  });

  it('validates URLs (accepts https)', () => {
    const id = createEntity({ kind: 'organization', preferredLabel: 'Org', homepageUrl: 'https://example.com' });
    const entity = getEntity(id);
    expect(entity!.homepageUrl).toBe('https://example.com/');
  });
});

describe('findEntitiesByLabel', () => {
  it('finds entities by normalized label', () => {
    createEntity({ kind: 'person', preferredLabel: 'Alice Smith' });
    const results = findEntitiesByLabel('alice smith');
    expect(results.length).toBe(1);
    expect(results[0].preferredLabel).toBe('Alice Smith');
  });

  it('is case-insensitive', () => {
    createEntity({ kind: 'person', preferredLabel: 'Bob Jones' });
    expect(findEntitiesByLabel('BOB JONES').length).toBe(1);
  });

  it('returns empty for no match', () => {
    expect(findEntitiesByLabel('nonexistent').length).toBe(0);
  });

  it('does not return tombstoned entities', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'Gone' });
    tombstoneEntity(id);
    expect(findEntitiesByLabel('gone').length).toBe(0);
  });
});

describe('findEntityByProvider', () => {
  it('finds entity by provider reference', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'WikiPerson' });
    addProviderReference(id, {
      provider: 'wikidata',
      providerId: 'Q12345',
      observedAt: new Date().toISOString(),
      evidenceIds: [],
    });
    const found = findEntityByProvider('wikidata', 'Q12345');
    expect(found).toBeDefined();
    expect(found!.entityId).toBe(id);
  });

  it('returns undefined for unknown provider ID', () => {
    expect(findEntityByProvider('wikidata', 'Q99999')).toBeUndefined();
  });
});

describe('addAlias', () => {
  it('adds an alias and makes it searchable', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'Robert' });
    addAlias(id, { alias: 'Bob', provider: 'local', addedAt: new Date().toISOString() });
    expect(findEntitiesByLabel('bob').length).toBe(1);
  });

  it('respects alias limit', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'Test' });
    for (let i = 0; i < 100; i++) {
      addAlias(id, { alias: `alias-${i}`, provider: 'local', addedAt: new Date().toISOString() });
    }
    // 101st should fail
    const result = addAlias(id, { alias: 'overflow', provider: 'local', addedAt: new Date().toISOString() });
    expect(result).toBe(false);
  });
});

describe('tombstoneEntity', () => {
  it('soft-deletes an entity', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'Doomed' });
    tombstoneEntity(id);
    expect(getEntity(id)).toBeUndefined();
  });

  it('returns false for nonexistent entity', () => {
    expect(tombstoneEntity('entity:nonexistent' as CanonicalEntityId)).toBe(false);
  });
});

describe('mergeEntities', () => {
  it('merges source into target', () => {
    const source = createEntity({ kind: 'person', preferredLabel: 'Alias Name' });
    const target = createEntity({ kind: 'person', preferredLabel: 'Real Name' });
    addAlias(source, { alias: 'Nickname', provider: 'local', addedAt: new Date().toISOString() });

    const result = mergeEntities(source, target);
    expect(result).toBe(true);

    // Source resolves to target
    expect(getEntity(source)!.entityId).toBe(target);

    // Target has the alias
    expect(findEntitiesByLabel('nickname').length).toBe(1);
    expect(findEntitiesByLabel('nickname')[0].entityId).toBe(target);
  });

  it('prevents self-merge', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'Self' });
    expect(mergeEntities(id, id)).toBe(false);
  });

  it('prevents merge of tombstoned entities', () => {
    const source = createEntity({ kind: 'person', preferredLabel: 'A' });
    const target = createEntity({ kind: 'person', preferredLabel: 'B' });
    tombstoneEntity(source);
    expect(mergeEntities(source, target)).toBe(false);
  });
});

describe('resolutions (account-scoped)', () => {
  it('stores and retrieves a resolution', () => {
    const resolution: EntityResolution = {
      schemaVersion: 1,
      resolutionKey: 'res-1',
      accountScope: 'https://instance.example/users/alice',
      mentionKey: '@bob',
      selectedEntityId: 'entity:123' as CanonicalEntityId,
      candidateEntityIds: ['entity:123' as CanonicalEntityId],
      confidence: 0.9,
      margin: 0.3,
      state: 'resolved',
      policyVersion: '1.0',
      evidenceIds: [],
      observedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    storeResolution(resolution);
    const retrieved = getResolution('https://instance.example/users/alice', '@bob');
    expect(retrieved).toBeDefined();
    expect(retrieved!.selectedEntityId).toBe('entity:123');
  });

  it('isolates resolutions by account scope', () => {
    const resolution: EntityResolution = {
      schemaVersion: 1,
      resolutionKey: 'res-2',
      accountScope: 'https://instance.example/users/alice',
      mentionKey: '@target',
      candidateEntityIds: [],
      confidence: 0,
      margin: 0,
      state: 'unresolved',
      policyVersion: '1.0',
      evidenceIds: [],
      observedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    storeResolution(resolution);

    // Bob cannot see Alice's resolution
    expect(getResolution('https://instance.example/users/bob', '@target')).toBeUndefined();
  });
});

describe('creator attributions', () => {
  it('stores and retrieves by resource URL', () => {
    const attr: LinkCreatorAttribution = {
      schemaVersion: 2,
      attributionKey: 'attr-1',
      accountScope: 'https://instance.example/users/alice',
      canonicalResourceUrl: 'https://blog.example/post-1',
      creatorEntityId: 'entity:author-1' as CanonicalEntityId,
      creatorRole: 'author',
      ordinal: 0,
      proof: 'native-server-verified',
      evidenceIds: [],
      observedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    storeCreatorAttribution(attr);

    const results = getAttributionsForResource(
      'https://instance.example/users/alice',
      'https://blog.example/post-1',
    );
    expect(results.length).toBe(1);
    expect(results[0].creatorRole).toBe('author');
  });

  it('isolates attributions by account scope', () => {
    const attr: LinkCreatorAttribution = {
      schemaVersion: 2,
      attributionKey: 'attr-2',
      accountScope: 'https://instance.example/users/alice',
      canonicalResourceUrl: 'https://blog.example/post-2',
      creatorEntityId: 'entity:author-2' as CanonicalEntityId,
      creatorRole: 'author',
      ordinal: 0,
      proof: 'structured-author',
      evidenceIds: [],
      observedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    storeCreatorAttribution(attr);

    // Bob cannot see Alice's attributions
    const results = getAttributionsForResource(
      'https://instance.example/users/bob',
      'https://blog.example/post-2',
    );
    expect(results.length).toBe(0);
  });
});

describe('purgeAccountData', () => {
  it('removes account-scoped resolutions and attributions', () => {
    storeResolution({
      schemaVersion: 1,
      resolutionKey: 'res-purge',
      accountScope: 'https://instance.example/users/alice',
      mentionKey: '@target',
      candidateEntityIds: [],
      confidence: 0,
      margin: 0,
      state: 'unresolved',
      policyVersion: '1.0',
      evidenceIds: [],
      observedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
    storeCreatorAttribution({
      schemaVersion: 2,
      attributionKey: 'attr-purge',
      accountScope: 'https://instance.example/users/alice',
      canonicalResourceUrl: 'https://example.com/article',
      creatorEntityId: 'entity:x' as CanonicalEntityId,
      creatorRole: 'author',
      ordinal: 0,
      proof: 'metadata-author',
      evidenceIds: [],
      observedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });

    const count = purgeAccountData('https://instance.example/users/alice');
    expect(count).toBe(2);
    expect(getResolution('https://instance.example/users/alice', '@target')).toBeUndefined();
  });

  it('does not purge shared entities', () => {
    const id = createEntity({ kind: 'person', preferredLabel: 'Shared Person' });
    purgeAccountData('https://instance.example/users/alice');
    expect(getEntity(id)).toBeDefined();
  });
});

describe('generateEntityId / isValidEntityId', () => {
  it('generates valid IDs', () => {
    const id = generateEntityId();
    expect(isValidEntityId(id)).toBe(true);
    expect(id.startsWith('entity:')).toBe(true);
  });

  it('rejects invalid IDs', () => {
    expect(isValidEntityId('')).toBe(false);
    expect(isValidEntityId(null)).toBe(false);
    expect(isValidEntityId('not-prefixed')).toBe(false);
    expect(isValidEntityId('entity:\x00bad')).toBe(false);
    expect(isValidEntityId(123)).toBe(false);
  });
});

describe('getDiagnostics', () => {
  it('returns correct counts', () => {
    createEntity({ kind: 'person', preferredLabel: 'A' });
    createEntity({ kind: 'organization', preferredLabel: 'B' });
    const diag = getDiagnostics();
    expect(diag.entityCount).toBe(2);
  });
});

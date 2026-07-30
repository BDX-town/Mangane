/**
 * Phase 6F — Compose bridge tests.
 *
 * Tests the compose → outbox routing bridge including payload conversion,
 * feature flag gating, and account scope validation.
 */

import 'fake-indexeddb/auto';

jest.mock('soapbox/db/instance', () => {
  const { ManganeDatabase: DB } = require('soapbox/db/schema');
  const instance = new DB(`test-compose-${Date.now()}`);
  return { __esModule: true, db: instance, default: instance };
});

// Mock the processor to prevent tick() from running during tests
jest.mock('../outbox-processor', () => ({
  onOperationEnqueued: jest.fn(),
  registerExecutor: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
  initialize: jest.fn(),
  stop: jest.fn(),
  onNetworkOnline: jest.fn(),
  tick: jest.fn(),
}));

import db from 'soapbox/db/instance';
import * as outboxRepo from 'soapbox/db/outbox-repository';

import {
  enqueueCompose,
  enqueueDelete,
  enqueueInteraction,
  enqueueMediaUpload,
  isOutboxComposeEnabled,
  setOutboxComposeEnabled,
} from '../compose-bridge';

beforeAll(async() => {
  await (db as any).open();
});

afterAll(async() => {
  await (db as any).delete();
});

afterEach(async() => {
  await (db as any).outbox.clear();
  setOutboxComposeEnabled(false);
});

const accountUrl = 'https://mastodon.social/users/alice';

describe('feature flag', () => {
  it('starts disabled', () => {
    expect(isOutboxComposeEnabled()).toBe(false);
  });

  it('can be enabled and disabled', () => {
    setOutboxComposeEnabled(true);
    expect(isOutboxComposeEnabled()).toBe(true);
    setOutboxComposeEnabled(false);
    expect(isOutboxComposeEnabled()).toBe(false);
  });
});

describe('enqueueCompose', () => {
  it('returns null when outbox is disabled', async() => {
    setOutboxComposeEnabled(false);
    const result = await enqueueCompose(accountUrl, { status: 'Hello' });
    expect(result).toBeNull();
  });

  it('returns null for invalid account URL', async() => {
    setOutboxComposeEnabled(true);
    const result = await enqueueCompose('not-a-url', { status: 'Hello' });
    expect(result).toBeNull();
  });

  it('enqueues a status.create when enabled', async() => {
    setOutboxComposeEnabled(true);
    const opId = await enqueueCompose(accountUrl, {
      status: 'Hello world!',
      visibility: 'public',
      sensitive: false,
    });
    expect(opId).not.toBeNull();
    expect(typeof opId).toBe('string');

    // Verify it's in the store
    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    expect(entry).toBeDefined();
    expect(entry!.operationType).toBe('status.create');
    expect(entry!.state).toBe('pending');
    expect((entry!.payload as any).content).toBe('Hello world!');
    expect((entry!.payload as any).visibility).toBe('public');
  });

  it('enqueues a status.edit when statusId is provided', async() => {
    setOutboxComposeEnabled(true);
    const opId = await enqueueCompose(accountUrl, {
      status: 'Edited content',
    }, 'status-123');
    expect(opId).not.toBeNull();

    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    expect(entry!.operationType).toBe('status.edit');
    expect((entry!.payload as any).statusId).toBe('status-123');
  });

  it('converts poll params correctly', async() => {
    setOutboxComposeEnabled(true);
    const opId = await enqueueCompose(accountUrl, {
      status: 'Poll time',
      poll: { options: ['A', 'B'], expires_in: 3600, multiple: true },
    });
    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    const poll = (entry!.payload as any).poll;
    expect(poll.options).toEqual(['A', 'B']);
    expect(poll.expiresIn).toBe(3600);
    expect(poll.multiple).toBe(true);
  });

  it('converts to array from Set', async() => {
    setOutboxComposeEnabled(true);
    const opId = await enqueueCompose(accountUrl, {
      status: 'Direct',
      to: new Set(['@user1', '@user2']),
    });
    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    expect((entry!.payload as any).to).toEqual(expect.arrayContaining(['@user1', '@user2']));
  });
});

describe('enqueueDelete', () => {
  it('returns null when disabled', async() => {
    const result = await enqueueDelete(accountUrl, 'status-1');
    expect(result).toBeNull();
  });

  it('enqueues a status.delete with high priority', async() => {
    setOutboxComposeEnabled(true);
    const opId = await enqueueDelete(accountUrl, 'status-1');
    expect(opId).not.toBeNull();

    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    expect(entry!.operationType).toBe('status.delete');
    expect(entry!.priority).toBe(10);
    expect((entry!.payload as any).statusId).toBe('status-1');
  });
});

describe('enqueueInteraction', () => {
  it('returns null when disabled', async() => {
    const result = await enqueueInteraction(accountUrl, 'status.favourite', 'status-1');
    expect(result).toBeNull();
  });

  it('enqueues an interaction with correct target field', async() => {
    setOutboxComposeEnabled(true);
    const opId = await enqueueInteraction(accountUrl, 'status.favourite', 'status-1');
    expect(opId).not.toBeNull();

    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    expect(entry!.operationType).toBe('status.favourite');
    expect((entry!.payload as any).statusId).toBe('status-1');
  });

  it('supports accountId target field', async() => {
    setOutboxComposeEnabled(true);
    const opId = await enqueueInteraction(accountUrl, 'account.follow', 'acc-1', 'accountId');
    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    expect((entry!.payload as any).accountId).toBe('acc-1');
  });
});

describe('enqueueMediaUpload', () => {
  it('returns null when disabled', async() => {
    const blob = new Blob(['test'], { type: 'image/png' });
    const result = await enqueueMediaUpload(accountUrl, blob);
    expect(result).toBeNull();
  });

  it('enqueues media upload with file and description', async() => {
    setOutboxComposeEnabled(true);
    const blob = new Blob(['image-data'], { type: 'image/jpeg' });
    const opId = await enqueueMediaUpload(accountUrl, blob, 'A photo', '0.5,0.5');
    expect(opId).not.toBeNull();

    const scope = { accountUrl };
    const entry = await outboxRepo.getEntry(scope, opId!);
    expect(entry!.operationType).toBe('media.upload');
    expect(entry!.priority).toBe(40);
    expect((entry!.payload as any).description).toBe('A photo');
    expect((entry!.payload as any).focus).toBe('0.5,0.5');
    // In real IndexedDB, structured clone preserves Blobs.
    // fake-indexeddb serializes to a plain object, so check existence.
    expect((entry!.payload as any).file).toBeDefined();
  });
});

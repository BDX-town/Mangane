/**
 * Phase 6 — Payload validation tests.
 *
 * Tests that executor payload validation rejects malformed, adversarial,
 * or oversized inputs. This is critical for IDOR/injection prevention since
 * payloads come from IndexedDB which could be corrupted or tampered with.
 */

import { ApplicationError } from 'soapbox/domain/application-error';


// Import executors directly to test their validation
import {
  executeAccountFollow,
  executeAccountBlock,
} from '../account-executors';
import {
  executeStatusFavourite,
  executeStatusReblog,
} from '../interaction-executors';
import { executeMediaUpload } from '../media-executor';
import {
  executePollVote,
  executeReportCreate,
  executeNotificationDismiss,
  executeMarkerUpdate,
} from '../misc-executors';
import { executeStatusCreate, executeStatusEdit, executeStatusDelete } from '../status-executors';

import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// Mock transport to isolate validation testing
jest.mock('../../outbox-transport', () => ({
  executeRequest: jest.fn().mockResolvedValue({ status: 200, data: {}, headers: {} }),
  UPLOAD_TIMEOUT_MS: 120_000,
}));

const scope: AccountScope = { accountUrl: 'https://instance.example/users/test' };
const signal = new AbortController().signal;

function makeEntry(payload: unknown): OutboxEntry {
  return {
    id: 'test-id',
    accountUrl: scope.accountUrl,
    operationType: 'status.create',
    state: 'in-flight',
    payload,
    idempotencyKey: null,
    idempotencyStrategy: 'none',
    conflictPolicy: 'fail-on-conflict',
    dependsOn: [],
    priority: 100,
    createdAt: Date.now(),
    attemptedAt: Date.now(),
    nextAttemptAt: null,
    completedAt: null,
    attemptCount: 1,
    maxAttempts: 5,
    lastFailureReason: null,
    lastErrorMessage: null,
    serverRetryAfterMs: null,
    result: null,
  };
}

describe('status.create payload validation', () => {
  it('rejects null payload', async() => {
    await expect(executeStatusCreate(makeEntry(null), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects non-object payload', async() => {
    await expect(executeStatusCreate(makeEntry('string'), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects missing content', async() => {
    await expect(executeStatusCreate(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects non-string content', async() => {
    await expect(executeStatusCreate(makeEntry({ content: 123 }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects excessively long content', async() => {
    await expect(executeStatusCreate(makeEntry({ content: 'x'.repeat(200_000) }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects mediaIds with control characters', async() => {
    await expect(executeStatusCreate(makeEntry({ content: 'hi', mediaIds: ['valid', 'inva\x00lid'] }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects too many media IDs', async() => {
    const mediaIds = Array.from({ length: 25 }, (_, i) => `id-${i}`);
    await expect(executeStatusCreate(makeEntry({ content: 'hi', mediaIds }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects empty media IDs', async() => {
    await expect(executeStatusCreate(makeEntry({ content: 'hi', mediaIds: [''] }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects inReplyToId with control chars', async() => {
    await expect(executeStatusCreate(makeEntry({ content: 'hi', inReplyToId: 'id\ninjection' }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects poll with zero options', async() => {
    await expect(executeStatusCreate(makeEntry({
      content: 'poll', poll: { options: [], expiresIn: 3600 },
    }), scope, signal)).rejects.toThrow(ApplicationError);
  });

  it('rejects poll with too short expiration', async() => {
    await expect(executeStatusCreate(makeEntry({
      content: 'poll', poll: { options: ['a', 'b'], expiresIn: 10 },
    }), scope, signal)).rejects.toThrow(ApplicationError);
  });

  it('accepts valid payload', async() => {
    await expect(executeStatusCreate(makeEntry({
      content: 'Hello world',
      visibility: 'public',
      sensitive: false,
    }), scope, signal)).resolves.toBeDefined();
  });
});

describe('status.edit payload validation', () => {
  it('rejects missing statusId', async() => {
    await expect(executeStatusEdit(makeEntry({ content: 'hi' }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects empty statusId', async() => {
    await expect(executeStatusEdit(makeEntry({ statusId: '', content: 'hi' }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('accepts valid edit payload', async() => {
    await expect(executeStatusEdit(makeEntry({
      statusId: '12345',
      content: 'Edited content',
    }), scope, signal)).resolves.toBeDefined();
  });
});

describe('status.delete payload validation', () => {
  it('rejects missing statusId', async() => {
    await expect(executeStatusDelete(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects overly long statusId', async() => {
    await expect(executeStatusDelete(makeEntry({ statusId: 'x'.repeat(600) }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('accepts valid delete payload', async() => {
    await expect(executeStatusDelete(makeEntry({ statusId: '12345' }), scope, signal))
      .resolves.toBeDefined();
  });
});

describe('interaction executor payload validation', () => {
  it('rejects null payload for favourite', async() => {
    await expect(executeStatusFavourite(makeEntry(null), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects missing statusId for reblog', async() => {
    await expect(executeStatusReblog(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects statusId with control characters', async() => {
    await expect(executeStatusFavourite(makeEntry({ statusId: 'id\x01' }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('accepts valid interaction payload', async() => {
    await expect(executeStatusFavourite(makeEntry({ statusId: '12345' }), scope, signal))
      .resolves.toBeDefined();
  });
});

describe('account executor payload validation', () => {
  it('rejects missing accountId for follow', async() => {
    await expect(executeAccountFollow(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects empty accountId', async() => {
    await expect(executeAccountBlock(makeEntry({ accountId: '' }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects accountId with control characters', async() => {
    await expect(executeAccountFollow(makeEntry({ accountId: 'id\x00' }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('accepts valid account payload', async() => {
    await expect(executeAccountFollow(makeEntry({ accountId: '12345' }), scope, signal))
      .resolves.toBeDefined();
  });
});

describe('media.upload payload validation', () => {
  it('rejects missing file', async() => {
    await expect(executeMediaUpload(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects non-Blob file', async() => {
    await expect(executeMediaUpload(makeEntry({ file: 'not-a-blob' }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects empty file', async() => {
    const emptyBlob = new Blob([], { type: 'image/png' });
    await expect(executeMediaUpload(makeEntry({ file: emptyBlob }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects disallowed MIME type', async() => {
    const badBlob = new Blob(['data'], { type: 'application/javascript' });
    await expect(executeMediaUpload(makeEntry({ file: badBlob }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects excessively long description', async() => {
    const blob = new Blob(['data'], { type: 'image/png' });
    await expect(executeMediaUpload(makeEntry({
      file: blob,
      description: 'x'.repeat(6000),
    }), scope, signal)).rejects.toThrow(ApplicationError);
  });

  it('accepts valid media payload', async() => {
    const blob = new Blob(['imagedata'], { type: 'image/png' });
    await expect(executeMediaUpload(makeEntry({
      file: blob,
      description: 'A nice photo',
    }), scope, signal)).resolves.toBeDefined();
  });
});

describe('poll.vote payload validation', () => {
  it('rejects missing pollId', async() => {
    await expect(executePollVote(makeEntry({ choices: [0] }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects empty choices', async() => {
    await expect(executePollVote(makeEntry({ pollId: '123', choices: [] }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects negative choice values', async() => {
    await expect(executePollVote(makeEntry({ pollId: '123', choices: [-1] }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('accepts valid poll vote', async() => {
    await expect(executePollVote(makeEntry({ pollId: '123', choices: [0, 2] }), scope, signal))
      .resolves.toBeDefined();
  });
});

describe('report.create payload validation', () => {
  it('rejects missing accountId', async() => {
    await expect(executeReportCreate(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects too many statusIds', async() => {
    const statusIds = Array.from({ length: 60 }, (_, i) => `id-${i}`);
    await expect(executeReportCreate(makeEntry({ accountId: '123', statusIds }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects excessively long comment', async() => {
    await expect(executeReportCreate(makeEntry({
      accountId: '123',
      comment: 'x'.repeat(3000),
    }), scope, signal)).rejects.toThrow(ApplicationError);
  });

  it('accepts valid report', async() => {
    await expect(executeReportCreate(makeEntry({
      accountId: '123',
      statusIds: ['456'],
      comment: 'Spam',
    }), scope, signal)).resolves.toBeDefined();
  });
});

describe('notification.dismiss payload validation', () => {
  it('rejects missing notificationId', async() => {
    await expect(executeNotificationDismiss(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('accepts valid notification dismiss', async() => {
    await expect(executeNotificationDismiss(makeEntry({ notificationId: '123' }), scope, signal))
      .resolves.toBeDefined();
  });
});

describe('marker.update payload validation', () => {
  it('rejects empty payload (no markers)', async() => {
    await expect(executeMarkerUpdate(makeEntry({}), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('rejects marker with empty lastReadId', async() => {
    await expect(executeMarkerUpdate(makeEntry({ home: { lastReadId: '' } }), scope, signal))
      .rejects.toThrow(ApplicationError);
  });

  it('accepts valid marker update', async() => {
    await expect(executeMarkerUpdate(makeEntry({
      home: { lastReadId: '12345' },
    }), scope, signal)).resolves.toBeDefined();
  });
});

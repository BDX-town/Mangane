/**
 * Phase 6 — Transport layer security tests.
 *
 * Tests SSRF prevention, token resolution, and URL validation
 * in the outbox transport layer.
 */

import { ApplicationError } from 'soapbox/domain/application-error';

// We test validateRequestUrl indirectly through executeRequest
// but can test the error cases by calling with invalid setups.
import { executeRequest, setStoreAccessor } from '../outbox-transport';

import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// Mock axios to prevent actual HTTP calls
jest.mock('axios', () => {
  const mockAxios: any = jest.fn().mockResolvedValue({ status: 200, data: {}, headers: {} });
  mockAxios.CancelToken = { source: () => ({ token: 'mock-token', cancel: jest.fn() }) };
  mockAxios.create = jest.fn(() => mockAxios);
  return { __esModule: true, default: mockAxios };
});

// Mock build config
jest.mock('soapbox/build_config', () => ({
  BACKEND_URL: '',
}));

const scope: AccountScope = { accountUrl: 'https://mastodon.social/users/test' };
const signal = new AbortController().signal;

function makeEntry(): OutboxEntry {
  return {
    id: 'test-id',
    accountUrl: scope.accountUrl,
    operationType: 'status.create',
    state: 'in-flight',
    payload: {},
    idempotencyKey: 'test-key-123',
    idempotencyStrategy: 'idempotency-key',
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

describe('outbox-transport', () => {
  describe('setStoreAccessor', () => {
    it('throws if store accessor not set', async() => {
      // Reset module state by clearing accessor
      setStoreAccessor(null as any);

      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: '/api/v1/test', signal }),
      ).rejects.toThrow(ApplicationError);
    });
  });

  describe('token resolution', () => {
    it('throws unauthenticated when no token available', async() => {
      setStoreAccessor(() => ({
        auth: {
          getIn: (path: string[]) => {
            if (path[0] === 'users' && path[2] === 'access_token') return undefined;
            return undefined;
          },
        },
      } as any));

      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: '/api/v1/test', signal }),
      ).rejects.toThrow(ApplicationError);
    });

    it('throws unauthenticated when token is empty string', async() => {
      setStoreAccessor(() => ({
        auth: {
          getIn: (path: string[]) => {
            if (path[0] === 'users' && path[2] === 'access_token') return '';
            return undefined;
          },
        },
      } as any));

      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: '/api/v1/test', signal }),
      ).rejects.toThrow(ApplicationError);
    });
  });

  describe('URL validation (SSRF prevention)', () => {
    beforeEach(() => {
      setStoreAccessor(() => ({
        auth: {
          getIn: (path: string[]) => {
            if (path[0] === 'users' && path[2] === 'access_token') return 'valid-token';
            return undefined;
          },
        },
      } as any));
    });

    it('accepts relative URLs', async() => {
      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: '/api/v1/statuses/123', signal }),
      ).resolves.toBeDefined();
    });

    it('rejects protocol-relative URLs', async() => {
      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: '//evil.com/api/steal', signal }),
      ).rejects.toThrow(ApplicationError);
    });

    it('rejects absolute URLs to different origins', async() => {
      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: 'https://evil.com/api/steal', signal }),
      ).rejects.toThrow(ApplicationError);
    });

    it('rejects URLs with non-HTTP protocols', async() => {
      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: 'file:///etc/passwd', signal }),
      ).rejects.toThrow(ApplicationError);
    });

    it('rejects URLs with embedded credentials', async() => {
      await expect(
        executeRequest(scope, makeEntry(), {
          method: 'GET',
          url: 'https://user:pass@mastodon.social/api/v1/test',
          signal,
        }),
      ).rejects.toThrow(ApplicationError);
    });

    it('rejects invalid URLs', async() => {
      await expect(
        executeRequest(scope, makeEntry(), { method: 'GET', url: 'https://[invalid', signal }),
      ).rejects.toThrow(ApplicationError);
    });
  });
});

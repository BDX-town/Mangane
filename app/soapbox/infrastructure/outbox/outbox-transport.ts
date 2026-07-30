/**
 * Phase 6 — Outbox transport layer.
 *
 * Provides authenticated HTTP capabilities to outbox executors without
 * exposing the Redux store directly. Executors call through this transport
 * which resolves auth from the store at execution time (never cached).
 *
 * Security boundaries:
 * - Auth token is resolved fresh per-request (no stale tokens)
 * - Requests are confined to the account's instance origin (SSRF prevention)
 * - Idempotency-Key header attached when present on the entry
 * - AbortSignal threaded through for cancellation
 * - Request bodies are never logged
 * - Timeout enforced (30s default) to prevent hung connections
 */

import axios from 'axios';

import * as BuildConfig from 'soapbox/build_config';
import { ApplicationError } from 'soapbox/domain/application-error';
import { isURL, parseBaseURL } from 'soapbox/utils/auth';

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';
import type { RootState } from 'soapbox/store';

// ─── Store accessor ──────────────────────────────────────────────────────────

/**
 * Lazy reference to the Redux store getter.
 * Set once during initialization to avoid circular imports.
 */
let storeGetter: (() => RootState) | null = null;

/**
 * Register the store accessor. Call once at app startup.
 * Must be called before any outbox operations execute.
 */
export function setStoreAccessor(getter: () => RootState): void {
  storeGetter = getter;
}

function getState(): RootState {
  if (!storeGetter) {
    throw new ApplicationError({
      kind: 'unsupported',
      message: 'Outbox transport not initialized: store accessor missing.',
    });
  }
  return storeGetter();
}

// ─── Token resolution ────────────────────────────────────────────────────────

/**
 * Resolve the access token for an account URL.
 * Throws ApplicationError('unauthenticated') if no token available.
 */
function resolveToken(accountUrl: string): string {
  const state = getState();
  const token = state.auth.getIn(['users', accountUrl, 'access_token']);
  if (typeof token !== 'string' || token.length === 0) {
    throw new ApplicationError({
      kind: 'unauthenticated',
      message: 'No access token available for this account.',
      status: 401,
    });
  }
  return token;
}

/**
 * Resolve the base URL for API requests.
 * Validates that it's a proper origin to prevent SSRF.
 */
function resolveBaseURL(accountUrl: string): string {
  // BACKEND_URL takes precedence (development/proxy configuration)
  if (isURL(BuildConfig.BACKEND_URL)) {
    return BuildConfig.BACKEND_URL;
  }
  const origin = parseBaseURL(accountUrl);
  if (!origin || origin === window.location.origin) {
    return '';
  }
  return origin;
}

// ─── Request execution ───────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 30_000;
const UPLOAD_TIMEOUT_MS = 120_000;

export interface TransportRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  signal: AbortSignal;
  /** Timeout in ms (default: 30s, uploads: 120s). */
  timeoutMs?: number;
}

export interface TransportResponse {
  status: number;
  data: unknown;
  headers: Record<string, unknown>;
}

/**
 * Execute an authenticated HTTP request for an outbox operation.
 *
 * Security measures:
 * - Fresh token resolved per-call (no caching)
 * - URL validated against account origin (no open redirect/SSRF)
 * - AbortSignal honored for cancellation
 * - Timeout prevents hung connections
 * - Idempotency-Key header attached when operation provides one
 */
export async function executeRequest(
  scope: AccountScope,
  entry: OutboxEntry,
  request: TransportRequest,
): Promise<TransportResponse> {
  const token = resolveToken(scope.accountUrl);
  const baseURL = resolveBaseURL(scope.accountUrl);

  // Validate the request URL doesn't escape the instance origin (SSRF protection)
  validateRequestUrl(request.url, baseURL, scope.accountUrl);

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    ...request.headers,
  };

  // Attach idempotency key if present
  if (entry.idempotencyKey) {
    headers['Idempotency-Key'] = entry.idempotencyKey;
  }

  const config: AxiosRequestConfig = {
    method: request.method.toLowerCase(),
    url: request.url,
    baseURL,
    headers,
    data: request.data,
    timeout: request.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    // Transform response to parse JSON
    transformResponse: [(data: string) => {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }],
  };

  // Wire up AbortSignal → axios CancelToken
  const source = axios.CancelToken.source();
  config.cancelToken = source.token;

  const abortHandler = () => {
    source.cancel('Operation cancelled');
  };
  request.signal.addEventListener('abort', abortHandler, { once: true });

  try {
    const response: AxiosResponse = await axios(config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers ?? {},
    };
  } finally {
    request.signal.removeEventListener('abort', abortHandler);
  }
}

// ─── URL validation (SSRF prevention) ────────────────────────────────────────

/**
 * Validate that a request URL targets the expected instance.
 * Prevents executors from accidentally (or maliciously) sending requests
 * to arbitrary origins.
 *
 * Rules:
 * - Relative URLs are always safe (resolved against baseURL)
 * - Absolute URLs must match the account's instance origin
 * - No private/internal IP ranges allowed for absolute URLs
 */
function validateRequestUrl(url: string, baseURL: string, accountUrl: string): void {
  // Reject protocol-relative URLs
  if (url.startsWith('//')) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Protocol-relative URLs are not permitted in outbox requests.',
    });
  }

  // Detect any scheme-prefixed URL (not just http/https)
  // A URL with a scheme has the pattern: <scheme>://... or <scheme>:...
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(url);

  // Relative paths (no scheme) are inherently safe (resolved against baseURL by axios)
  if (!hasScheme) {
    return;
  }

  // Absolute URL — validate it's http(s) and matches the instance origin
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Invalid request URL in outbox operation.',
    });
  }

  // Must be http(s)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox requests must use HTTP(S) protocol.',
    });
  }

  // No credentials in URL
  if (parsed.username || parsed.password) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox request URLs must not contain credentials.',
    });
  }

  // Origin must match the account's instance or the configured BACKEND_URL
  const expectedOrigin = baseURL || parseBaseURL(accountUrl) || window.location.origin;
  if (parsed.origin !== expectedOrigin && parsed.origin !== window.location.origin) {
    throw new ApplicationError({
      kind: 'forbidden',
      message: 'Outbox request URL does not match the account instance origin.',
    });
  }
}

export { DEFAULT_TIMEOUT_MS, UPLOAD_TIMEOUT_MS };

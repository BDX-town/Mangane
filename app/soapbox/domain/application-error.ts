type ApplicationErrorKind =
  | 'cancelled'
  | 'offline'
  | 'unauthenticated'
  | 'forbidden'
  | 'unsupported'
  | 'rate-limited'
  | 'validation'
  | 'protocol'
  | 'transient'
  | 'unknown';

type ApplicationErrorOptions = {
  kind: ApplicationErrorKind;
  message: string;
  retryable?: boolean;
  status?: number;
  retryAfterMs?: number;
};

class ApplicationError extends Error {

  readonly kind: ApplicationErrorKind;
  readonly retryable: boolean;
  readonly status?: number;
  readonly retryAfterMs?: number;

  constructor({
    kind,
    message,
    retryable = false,
    status,
    retryAfterMs,
  }: ApplicationErrorOptions) {
    super(message);
    this.name = 'ApplicationError';
    this.kind = kind;
    this.retryable = retryable;
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }

}

type TransportErrorLike = {
  code?: string;
  message?: string;
  name?: string;
  response?: {
    headers?: Record<string, unknown>;
    status?: number;
  };
};

const parseRetryAfterMs = (value: unknown, now: number): number | undefined => {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const seconds = Number(value);
  const delay = Number.isFinite(seconds)
    ? seconds * 1000
    : Date.parse(String(value)) - now;
  if (!Number.isFinite(delay)) return undefined;
  return Math.min(Math.max(Math.ceil(delay), 0), 15 * 60 * 1000);
};

const normalizeTransportError = (
  error: unknown,
  { online = true, now = Date.now() }: { online?: boolean; now?: number } = {},
): ApplicationError => {
  if (error instanceof ApplicationError) return error;
  const candidate = (error && typeof error === 'object' ? error : {}) as TransportErrorLike;
  if (candidate.name === 'AbortError' || candidate.code === 'ERR_CANCELED' || candidate.code === 'ABORT_ERR') {
    return new ApplicationError({ kind: 'cancelled', message: 'The request was cancelled.' });
  }
  const status = candidate.response?.status;
  if (status === 401) {
    return new ApplicationError({ kind: 'unauthenticated', message: 'Authentication is required.', status });
  }
  if (status === 403) {
    return new ApplicationError({ kind: 'forbidden', message: 'The request is not authorized.', status });
  }
  if (status === 429) {
    const retryAfter = candidate.response?.headers?.['retry-after'];
    return new ApplicationError({
      kind: 'rate-limited',
      message: 'The server is rate limiting requests.',
      retryable: true,
      retryAfterMs: parseRetryAfterMs(retryAfter, now),
      status,
    });
  }
  if (typeof status === 'number' && status >= 500) {
    return new ApplicationError({
      kind: 'transient',
      message: 'The server is temporarily unavailable.',
      retryable: true,
      status,
    });
  }
  if (!online || (!status && /network error/i.test(candidate.message || ''))) {
    return new ApplicationError({
      kind: online ? 'transient' : 'offline',
      message: online ? 'The network request failed.' : 'The device is offline.',
      retryable: true,
    });
  }
  return new ApplicationError({
    kind: 'unknown',
    message: 'The request failed.',
    status,
  });
};

const unsupportedCapabilityError = (capability: string): ApplicationError => new ApplicationError({
  kind: 'unsupported',
  message: `The server does not support ${capability}.`,
});

export {
  ApplicationError,
  normalizeTransportError,
  parseRetryAfterMs,
  unsupportedCapabilityError,
};

export type {
  ApplicationErrorKind,
  ApplicationErrorOptions,
};

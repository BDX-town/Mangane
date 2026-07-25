/* eslint-disable no-console -- this module is the sole console security boundary */
const REDACTED = '[REDACTED]';
const TRUNCATED = '[TRUNCATED]';
const MAX_DEPTH = 6;
const MAX_KEYS = 50;
const MAX_STRING = 2_048;
const MAX_TOTAL = 16_384;

const sensitiveKeys = new Set([
  'account', 'accountid', 'accesstoken', 'authorization', 'body', 'browserid',
  'clientsecret', 'code', 'componentstack', 'content', 'cookie', 'data',
  'deviceid', 'directmessage', 'draft', 'email', 'headers', 'input', 'message',
  'mfa', 'otp', 'output', 'passwd', 'password', 'path', 'privatecontent',
  'prompt', 'referrer', 'refreshtoken', 'request', 'response', 'searchhistory',
  'searchquery', 'secret', 'session', 'setcookie', 'stack', 'token', 'url',
  'user', 'userid', 'username',
]);

const confusableAscii: Record<string, string> = {
  'а': 'a', 'ɑ': 'a', 'α': 'a', 'в': 'b', 'с': 'c', 'ϲ': 'c', 'е': 'e',
  'ε': 'e', 'і': 'i', 'ι': 'i', 'κ': 'k', 'м': 'm', 'н': 'h', 'о': 'o',
  'ο': 'o', 'р': 'p', 'ρ': 'p', 'т': 't', 'τ': 't', 'у': 'y', 'υ': 'y',
  'х': 'x', 'χ': 'x',
};
const normalizeKey = (key: string): string => [...key.normalize('NFKC').toLowerCase()]
  .map(character => confusableAscii[character] || character)
  .join('')
  .replace(/[^a-z0-9]/g, '');
const isSensitiveKey = (key: string): boolean => sensitiveKeys.has(normalizeKey(key));

const redactText = (input: string): string => {
  let value = input
    .replace(/\bBearer\s+[^\s,;]+/gi, `Bearer ${REDACTED}`)
    .replace(/\b(access[_-]?token|refresh[_-]?token|client[_-]?secret|password|authorization|cookie|mfa|otp|code)\s*[:=]\s*([^&\s]+)/gi, `$1=${REDACTED}`)
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, REDACTED);

  value = value.replace(/\bhttps?:\/\/[^\s]+/gi, candidate => {
    try {
      const url = new URL(candidate);
      if (url.search) url.search = `?${REDACTED}`;
      if (url.hash) url.hash = `#${REDACTED}`;
      url.username = '';
      url.password = '';
      return url.toString();
    } catch {
      return REDACTED;
    }
  });

  return value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}${TRUNCATED}` : value;
};

type Budget = { remaining: number };

const redactValue = (value: unknown, depth: number, seen: WeakSet<object>, budget: Budget): unknown => {
  if (budget.remaining <= 0) return TRUNCATED;
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') {
    const redacted = redactText(value);
    budget.remaining -= redacted.length;
    return redacted;
  }
  if (typeof value === 'undefined') return undefined;
  if (typeof value === 'bigint') return String(value);
  if (typeof value === 'symbol' || typeof value === 'function') return `[${typeof value}]`;
  if (depth >= MAX_DEPTH) return TRUNCATED;
  if (seen.has(value)) return '[CIRCULAR]';
  seen.add(value);

  try {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const output: Record<string, unknown> = {};
    const keys = Object.keys(descriptors).slice(0, MAX_KEYS);
    for (const key of keys) {
      if (isSensitiveKey(key)) {
        output[key] = REDACTED;
        continue;
      }
      const descriptor = descriptors[key];
      output[key] = descriptor && 'value' in descriptor
        ? redactValue(descriptor.value, depth + 1, seen, budget)
        : REDACTED;
    }
    if (Object.keys(descriptors).length > MAX_KEYS) output.__truncated__ = true;
    return Array.isArray(value) ? keys.map(key => output[key]) : output;
  } catch {
    return REDACTED;
  }
};

export const redactDiagnosticValue = (value: unknown): unknown => {
  try {
    return redactValue(value, 0, new WeakSet(), { remaining: MAX_TOTAL });
  } catch {
    return REDACTED;
  }
};

const originalConsole = {
  debug: console.debug.bind(console),
  error: console.error.bind(console),
  info: console.info.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
};

let installed = false;

/** Disable production diagnostics and redact development output before console serialization. */
export const installDiagnosticConsolePolicy = (): void => {
  if (installed) return;
  installed = true;
  const enabled = process.env.NODE_ENV === 'development';
  (Object.keys(originalConsole) as Array<keyof typeof originalConsole>).forEach(level => {
    console[level] = enabled
      ? (...values: unknown[]) => originalConsole[level](...values.map(redactDiagnosticValue))
      : () => undefined;
  });
};

/** A fixed, content-free self-XSS warning is the only production console output. */
export const printSecurityNotice = (): void => {
  originalConsole.log('%cStop!', ['color: red; font-size: 50px; font-weight: bold;']);
  originalConsole.log('%cThis browser console is for developers. Pasting instructions here can compromise your account.', ['font-size: 16px;']);
};

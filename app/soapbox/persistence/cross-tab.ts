import * as BuildConfig from 'soapbox/build_config';

interface PurgeMessage {
  accountUrl: string,
  generation: number,
  source: string,
  type: 'PURGE_ACCOUNT',
  version: 1,
}

type PurgeListener = (accountUrl: string, generation: number) => void;

const CHANNEL_NAME = `soapbox${BuildConfig.FE_SUBDIRECTORY || ''}:persistence:v1`;
const STORAGE_EVENT_KEY = `${CHANNEL_NAME}:event`;
const source = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let channel: BroadcastChannel | undefined;

const isValidMessage = (value: unknown): value is PurgeMessage => {
  if (!value || typeof value !== 'object') return false;
  const message = value as Partial<PurgeMessage>;
  if (message.type !== 'PURGE_ACCOUNT' || message.version !== 1 || message.source === source) return false;
  if (!Number.isSafeInteger(message.generation) || Number(message.generation) < 1) return false;
  if (typeof message.accountUrl !== 'string' || message.accountUrl.length > 2048) return false;
  try {
    return ['http:', 'https:'].includes(new URL(message.accountUrl).protocol);
  } catch {
    return false;
  }
};

const broadcastAccountPurge = (accountUrl: string, generation: number): void => {
  const message: PurgeMessage = { accountUrl, generation, source, type: 'PURGE_ACCOUNT', version: 1 };
  try {
    channel?.postMessage(message);
  } catch {
    // The storage event below remains the compatibility path.
  }
  try {
    localStorage.setItem(STORAGE_EVENT_KEY, JSON.stringify(message));
    localStorage.removeItem(STORAGE_EVENT_KEY);
  } catch {
    // The durable lifecycle record is still observed during response/write fencing.
  }
};

const installAccountPurgeListener = (listener: PurgeListener): (() => void) => {
  const receive = (value: unknown) => {
    if (isValidMessage(value)) listener(value.accountUrl, value.generation);
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_EVENT_KEY || !event.newValue) return;
    try {
      receive(JSON.parse(event.newValue));
    } catch {
      // Ignore malformed same-origin messages.
    }
  };

  if ('BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.addEventListener('message', event => receive(event.data));
    } catch {
      channel = undefined;
    }
  }
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener('storage', onStorage);
    channel?.close();
    channel = undefined;
  };
};

export {
  CHANNEL_NAME,
  STORAGE_EVENT_KEY,
  broadcastAccountPurge,
  installAccountPurgeListener,
  isValidMessage,
};

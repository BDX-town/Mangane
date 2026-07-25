'use strict';

import WebSocketClient from '@gamestdio/websocket';

import { captureSessionGeneration, isSessionGenerationActive } from 'soapbox/persistence/lifecycle';
import { getAccessToken } from 'soapbox/utils/auth';

import type { AppDispatch, RootState } from 'soapbox/store';

const randomIntUpTo = (max: number) => Math.floor(Math.random() * Math.floor(max));
const activeDisconnectors = new Set<() => void>();

const disconnectAllStreams = (): void => {
  for (const disconnect of [...activeDisconnectors]) disconnect();
};

export function connectStream(
  path: string,
  pollingRefresh: ((dispatch: AppDispatch, done?: () => void) => void) | null = null,
  callbacks: (dispatch: AppDispatch, getState: () => RootState) => Record<string, any> = () => ({ onConnect() {}, onDisconnect() {}, onReceive() {} }),
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const streamingAPIBaseURL = getState().instance.urls.get('streaming_api');
    const accessToken = getAccessToken(getState());
    const generation = captureSessionGeneration();
    const { onConnect, onDisconnect, onReceive } = callbacks(dispatch, getState);
    const generationIsActive = () => isSessionGenerationActive(generation);

    let polling: NodeJS.Timeout | null = null;

    const setupPolling = () => {
      if (pollingRefresh) {
        if (!generationIsActive()) return;
        pollingRefresh(dispatch, () => {
          if (generationIsActive()) {
            polling = setTimeout(() => setupPolling(), 20000 + randomIntUpTo(20000));
          }
        });
      }
    };

    const clearPolling = () => {
      if (polling) {
        clearTimeout(polling);
        polling = null;
      }
    };

    let subscription: WebSocketClient;

    // If the WebSocket fails to be created, don't crash the whole page,
    // just proceed without a subscription.
    try {
      subscription = getStream(streamingAPIBaseURL!, accessToken, path, {
        connected() {
          if (!generationIsActive()) return;
          if (pollingRefresh) {
            clearPolling();
          }

          onConnect();
        },

        disconnected() {
          if (!generationIsActive()) return;
          if (pollingRefresh) {
            polling = setTimeout(() => setupPolling(), randomIntUpTo(40000));
          }

          onDisconnect();
        },

        received(data) {
          if (generationIsActive()) onReceive(data);
        },

        reconnected() {
          if (!generationIsActive()) return;
          if (pollingRefresh) {
            clearPolling();
            pollingRefresh(dispatch);
          }

          onConnect();
        },

      });
    } catch (e) {
      console.error(e);
    }

    const disconnect = () => {
      if (subscription) {
        subscription.close();
      }

      clearPolling();
      activeDisconnectors.delete(disconnect);
    };

    activeDisconnectors.add(disconnect);
    return disconnect;
  };
}

export { disconnectAllStreams };

export default function getStream(
  streamingAPIBaseURL: string,
  accessToken: string,
  stream: string,
  { connected, received, disconnected, reconnected }: {
    connected: ((this: WebSocket, ev: Event) => any) | null,
    received: (data: any) => void,
    disconnected: ((this: WebSocket, ev: Event) => any) | null,
    reconnected: ((this: WebSocket, ev: Event) => any),
  },
) {
  const params = [ `stream=${stream}` ];

  const ws = new WebSocketClient(`${streamingAPIBaseURL}/api/v1/streaming/?${params.join('&')}`, accessToken as any);

  ws.onopen      = connected;
  ws.onclose     = disconnected;
  ws.onreconnect = reconnected;

  ws.onmessage   = (e) => {
    if (!e.data) return;
    try {
      received(JSON.parse(e.data));
    } catch (error) {
      console.error(e);
      console.error(`Could not parse the above streaming event.\n${error}`);
    }
  };

  return ws;
}

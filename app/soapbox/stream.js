'use strict';

import WebSocketClient from '@gamestdio/websocket';
import { getAccessToken } from 'soapbox/utils/auth';

const randomIntUpTo = max => Math.floor(Math.random() * Math.floor(max));

export function connectStream(path, pollingRefresh = null, callbacks = () => ({ onConnect() {}, onDisconnect() {}, onReceive() {} })) {
  return (dispatch, getState) => {
    const streamingAPIBaseURL = getState().getIn(['instance', 'urls', 'streaming_api']);
    const accessToken = getAccessToken(getState());
    const { onConnect, onDisconnect, onReceive } = callbacks(dispatch, getState);

    let polling = null;

    const setupPolling = () => {
      pollingRefresh(dispatch, () => {
        polling = setTimeout(() => setupPolling(), 20000 + randomIntUpTo(20000));
      });
    };

    const clearPolling = () => {
      if (polling) {
        clearTimeout(polling);
        polling = null;
      }
    };

    const subscription = getStream(streamingAPIBaseURL, accessToken, path, {
      connected() {
        if (pollingRefresh) {
          clearPolling();
        }

        onConnect();
      },

      disconnected() {
        if (pollingRefresh) {
          polling = setTimeout(() => setupPolling(), randomIntUpTo(40000));
        }

        onDisconnect();
      },

      received(data) {
        onReceive(data);
      },

      reconnected() {
        if (pollingRefresh) {
          clearPolling();
          pollingRefresh(dispatch);
        }

        onConnect();
      },

    });

    const disconnect = () => {
      if (subscription) {
        subscription.close();
      }

      clearPolling();
    };

    return disconnect;
  };
}


export default function getStream(streamingAPIBaseURL, accessToken, stream, { connected, received, disconnected, reconnected }) {
  const params = [ `stream=${stream}` ];

  const ws = new WebSocketClient(`${streamingAPIBaseURL}/api/v1/streaming/?${params.join('&')}`, accessToken);

  ws.onopen      = connected;
  ws.onclose     = disconnected;
  ws.onreconnect = reconnected;

  ws.onmessage   = (e) => {
    if (!e.data) return;
    try {
      received(JSON.parse(e.data));
    } catch(error) {
      console.error(e);
      console.error(`Could not parse the above streaming event.\n${error}`);
    }
  };

  return ws;
}

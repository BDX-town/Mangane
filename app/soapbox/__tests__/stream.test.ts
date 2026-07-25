import { fromJS } from 'immutable';

import { advanceSessionGeneration } from '../persistence/lifecycle';
import { connectStream, disconnectAllStreams } from '../stream';

const mockClients: any[] = [];

jest.mock('@gamestdio/websocket', () => class MockWebSocketClient {

  close = jest.fn();
  onclose?: () => void;
  onmessage?: (event: { data: string }) => void;
  onopen?: () => void;
  onreconnect?: () => void;

  constructor() {
    mockClients.push(this);
  }

});

jest.mock('soapbox/utils/auth', () => ({
  getAccessToken: () => 'secret-token',
}));

describe('stream session generation fence', () => {
  beforeEach(() => {
    mockClients.length = 0;
  });

  afterEach(() => {
    disconnectAllStreams();
  });

  it('rejects messages from a stream opened before an account transition', () => {
    const onReceive = jest.fn();
    const thunk = connectStream('user', null, () => ({ onReceive }));
    const disconnect = thunk(jest.fn() as any, () => ({
      instance: { urls: fromJS({ streaming_api: 'wss://social.example' }) },
    } as any));

    expect(mockClients).toHaveLength(1);
    advanceSessionGeneration();
    mockClients[0].onmessage({ data: JSON.stringify({ event: 'update' }) });

    expect(onReceive).not.toHaveBeenCalled();
    disconnect();
  });

  it('closes all active streams during account purge', () => {
    const thunk = connectStream('user');
    thunk(jest.fn() as any, () => ({
      instance: { urls: fromJS({ streaming_api: 'wss://social.example' }) },
    } as any));

    disconnectAllStreams();

    expect(mockClients[0].close).toHaveBeenCalledTimes(1);
  });
});

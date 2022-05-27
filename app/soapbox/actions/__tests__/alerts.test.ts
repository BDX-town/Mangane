import { AxiosError } from 'axios';

import { mockStore } from 'soapbox/jest/test-helpers';
import rootReducer from 'soapbox/reducers';

import { dismissAlert, showAlert, showAlertForError } from '../alerts';

const buildError = (message: string, status: number) => new AxiosError<any>(message, String(status), null, null, {
  data: {
    error: message,
  },
  statusText: String(status),
  status,
  headers: {},
  config: {},
});

let store;

beforeEach(() => {
  const state = rootReducer(undefined, {});
  store = mockStore(state);
});

describe('dismissAlert()', () => {
  it('dispatches the proper actions', async() => {
    const alert = 'hello world';
    const expectedActions = [
      { type: 'ALERT_DISMISS', alert },
    ];
    await store.dispatch(dismissAlert(alert));
    const actions = store.getActions();

    expect(actions).toEqual(expectedActions);
  });
});

describe('showAlert()', () => {
  it('dispatches the proper actions', async() => {
    const title = 'title';
    const message = 'msg';
    const severity = 'info';
    const expectedActions = [
      { type: 'ALERT_SHOW', title, message, severity },
    ];
    await store.dispatch(showAlert(title, message, severity));
    const actions = store.getActions();

    expect(actions).toEqual(expectedActions);
  });
});

describe('showAlert()', () => {
  describe('with a 502 status code', () => {
    it('dispatches the proper actions', async() => {
      const message = 'The server is down';
      const error = buildError(message, 502);

      const expectedActions = [
        { type: 'ALERT_SHOW', title: '', message, severity: 'error' },
      ];
      await store.dispatch(showAlertForError(error));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with a 404 status code', () => {
    it('dispatches the proper actions', async() => {
      const error = buildError('', 404);

      const expectedActions = [];
      await store.dispatch(showAlertForError(error));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with a 410 status code', () => {
    it('dispatches the proper actions', async() => {
      const error = buildError('', 410);

      const expectedActions = [];
      await store.dispatch(showAlertForError(error));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with an accepted status code', () => {
    describe('with a message from the server', () => {
      it('dispatches the proper actions', async() => {
        const message = 'custom message';
        const error = buildError(message, 200);

        const expectedActions = [
          { type: 'ALERT_SHOW', title: '', message, severity: 'error' },
        ];
        await store.dispatch(showAlertForError(error));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('without a message from the server', () => {
      it('dispatches the proper actions', async() => {
        const message = 'The request has been accepted for processing';
        const error = buildError(message, 202);

        const expectedActions = [
          { type: 'ALERT_SHOW', title: '', message, severity: 'error' },
        ];
        await store.dispatch(showAlertForError(error));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('without a response', () => {
    it('dispatches the proper actions', async() => {
      const error = new AxiosError();

      const expectedActions = [
        {
          type: 'ALERT_SHOW',
          title: {
            defaultMessage: 'Oops!',
            id: 'alert.unexpected.title',
          },
          message: {
            defaultMessage: 'An unexpected error occurred.',
            id: 'alert.unexpected.message',
          },
          severity: 'error',
        },
      ];
      await store.dispatch(showAlertForError(error));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

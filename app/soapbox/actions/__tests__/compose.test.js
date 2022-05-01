import { mockStore } from 'soapbox/jest/test-helpers';
import { InstanceRecord } from 'soapbox/normalizers';
import rootReducer from 'soapbox/reducers';

import { uploadCompose } from '../compose';

describe('uploadCompose()', () => {
  describe('with images', () => {
    let files, store;

    beforeEach(() => {
      const instance = InstanceRecord({
        configuration: {
          statuses: {
            max_media_attachments: 4,
          },
          media_attachments: {
            image_size_limit: 10,
          },
        },
      });

      const state = rootReducer(undefined, {})
        .set('me', '1234')
        .set('instance', instance);

      store = mockStore(state);
      files = [{
        uri: 'image.png',
        name: 'Image',
        size: 15,
        type: 'image/png',
      }];
    });

    it('creates an alert if exceeds max size', async() => {
      const mockIntl = {
        formatMessage: jest.fn().mockReturnValue('Image exceeds the current file size limit (10 Bytes)'),
      };

      const expectedActions = [
        { type: 'COMPOSE_UPLOAD_REQUEST', skipLoading: true },
        {
          type: 'ALERT_SHOW',
          message: 'Image exceeds the current file size limit (10 Bytes)',
          actionLabel: undefined,
          actionLink: undefined,
          severity: 'error',
        },
        { type: 'COMPOSE_UPLOAD_FAIL', error: true, skipLoading: true },
      ];

      await store.dispatch(uploadCompose(files, mockIntl));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with videos', () => {
    let files, store;

    beforeEach(() => {
      const instance = InstanceRecord({
        configuration: {
          statuses: {
            max_media_attachments: 4,
          },
          media_attachments: {
            video_size_limit: 10,
          },
        },
      });

      const state = rootReducer(undefined, {})
        .set('me', '1234')
        .set('instance', instance);

      store = mockStore(state);
      files = [{
        uri: 'video.mp4',
        name: 'Video',
        size: 15,
        type: 'video/mp4',
      }];
    });

    it('creates an alert if exceeds max size', async() => {
      const mockIntl = {
        formatMessage: jest.fn().mockReturnValue('Video exceeds the current file size limit (10 Bytes)'),
      };

      const expectedActions = [
        { type: 'COMPOSE_UPLOAD_REQUEST', skipLoading: true },
        {
          type: 'ALERT_SHOW',
          message: 'Video exceeds the current file size limit (10 Bytes)',
          actionLabel: undefined,
          actionLink: undefined,
          severity: 'error',
        },
        { type: 'COMPOSE_UPLOAD_FAIL', error: true, skipLoading: true },
      ];

      await store.dispatch(uploadCompose(files, mockIntl));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

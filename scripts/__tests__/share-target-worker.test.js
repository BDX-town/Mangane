'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const workerSource = fs.readFileSync(
  path.resolve(__dirname, '../../app/soapbox/service_worker/share_target.js'),
  'utf8',
);

const loadWorker = () => {
  let fetchListener;
  const response = class Response {

    constructor(body, options) {
      this.body = body;
      this.status = options.status;
    }

    static redirect(location, status) {
      return { location, status };
    }

  };
  vm.runInNewContext(workerSource, {
    Number,
    Response: response,
    URL,
    URLSearchParams,
    self: {
      addEventListener: (type, listener) => {
        if (type === 'fetch') fetchListener = listener;
      },
      location: { origin: 'https://social.example' },
    },
  });
  return fetchListener;
};

const request = ({
  contentLength,
  contentType = 'application/x-www-form-urlencoded',
  fields = {},
  method = 'POST',
  url = 'https://social.example/share',
} = {}) => ({
  formData: async() => ({ get: key => fields[key] }),
  headers: {
    get: key => key === 'content-type' ? contentType : contentLength,
  },
  method,
  url,
});

const dispatch = async(input) => {
  let response;
  loadWorker()({
    request: input,
    respondWith: promise => {
      response = promise;
    },
  });
  return response && await response;
};

test('redirects bounded same-origin share text to the inert composer parameter', async() => {
  const response = await dispatch(request({
    fields: { description: 'Description', link: 'https://elsewhere.example/post', name: 'Name' },
  }));
  assert.equal(response.status, 303);
  assert.equal(
    response.location,
    '/statuses/compose?text=Name%0ADescription%0A%0Ahttps%3A%2F%2Felsewhere.example%2Fpost',
  );
});

test('does not intercept cross-origin, path-confused, or non-POST requests', async() => {
  assert.equal(await dispatch(request({ url: 'https://attacker.example/share' })), undefined);
  assert.equal(await dispatch(request({ url: 'https://social.example/share-preview' })), undefined);
  assert.equal(await dispatch(request({ method: 'GET' })), undefined);
});

test('rejects unsupported, declared-oversize, and malformed forms', async() => {
  assert.equal((await dispatch(request({ contentType: 'application/json' }))).status, 415);
  assert.equal((await dispatch(request({ contentLength: '16385' }))).status, 413);
  const malformed = request();
  malformed.formData = async() => {
    throw new Error('malformed multipart');
  };
  assert.equal((await dispatch(malformed)).status, 400);
});

test('bounds accepted text and strips NUL bytes', async() => {
  const response = await dispatch(request({
    fields: {
      description: 'd'.repeat(5000),
      link: 'l'.repeat(3000),
      name: `safe\0${'n'.repeat(400)}`,
    },
  }));
  const params = new URLSearchParams(response.location.split('?')[1]);
  const [name, description, , link] = params.get('text').split('\n');
  assert.equal(name.includes('\0'), false);
  assert.equal(name.length, 256);
  assert.equal(description.length, 4096);
  assert.equal(link.length, 2048);
});

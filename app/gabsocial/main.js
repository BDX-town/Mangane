'use strict';

import * as registerPushNotifications from './actions/push_notifications';
import { default as GabSocial, store } from './containers/gabsocial';
import React from 'react';
import ReactDOM from 'react-dom';
import ready from './ready';

const perf = require('./performance');

function main() {
  perf.start('main()');

  // if (window.history && history.replaceState) {
  //   const { pathname, search, hash } = window.location;
  //   const path = pathname + search + hash;
  //   if (!(/^\/[$/]/).test(path)) {
  //     console.log('redirecting you to hell');
  //     history.replaceState(null, document.title, `${path}`);
  //   }
  // }

  ready(() => {
    const mountNode = document.getElementById('gabsocial');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<GabSocial {...props} />, mountNode);
    if (process.env.NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      require('offline-plugin/runtime').install();
      store.dispatch(registerPushNotifications.register());
    }
    perf.stop('main()');
  });
}

export default main;

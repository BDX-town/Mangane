'use strict';

import './wdyr';
// FIXME: Push notifications are temporarily removed
// import * as registerPushNotifications from './actions/push_notifications';
// import { default as Soapbox, store } from './containers/soapbox';
import { default as Soapbox } from './containers/soapbox';
import React from 'react';
import ReactDOM from 'react-dom';
import ready from './ready';

const perf = require('./performance');

function main() {
  perf.start('main()');

  ready(() => {
    const mountNode = document.getElementById('soapbox');

    ReactDOM.render(<Soapbox />, mountNode);
    if (process.env.NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      require('offline-plugin/runtime').install();
      // FIXME: Push notifications are temporarily removed
      // store.dispatch(registerPushNotifications.register());
    }
    perf.stop('main()');
  });
}

export default main;

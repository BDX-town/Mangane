'use strict';

import './precheck';
// FIXME: Push notifications are temporarily removed
// import * as registerPushNotifications from './actions/push_notifications';
// import { default as Soapbox, store } from './containers/soapbox';
import { default as Soapbox } from './containers/soapbox';
import React from 'react';
import ReactDOM from 'react-dom';
import * as OfflinePluginRuntime from '@lcdp/offline-plugin/runtime';
import * as perf from './performance';
import * as monitoring from './monitoring';
import ready from './ready';
import { NODE_ENV } from 'soapbox/build_config';

function main() {
  perf.start('main()');

  // Sentry
  monitoring.start();

  ready(() => {
    const mountNode = document.getElementById('soapbox');

    ReactDOM.render(<Soapbox />, mountNode);

    if (NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      OfflinePluginRuntime.install();
      // FIXME: Push notifications are temporarily removed
      // store.dispatch(registerPushNotifications.register());
    }
    perf.stop('main()');
  });
}

export default main;

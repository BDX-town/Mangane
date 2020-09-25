'use strict';

import * as registerPushNotifications from './actions/push_notifications';
import { default as Soapbox, store } from './containers/soapbox';
import React from 'react';
import ReactDOM from 'react-dom';
import ready from './ready';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

const perf = require('./performance');

function main() {
  perf.start('main()');

  ready(() => {
    const mountNode = document.getElementById('soapbox');

    ReactDOM.render(<Soapbox />, mountNode);
    OfflinePluginRuntime.install();
    store.dispatch(registerPushNotifications.register());
    perf.stop('main()');
  });
}

export default main;
